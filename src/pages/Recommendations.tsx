import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { estatePlanningElements, categoryLabels, goalLabels, type Category, type EstatePlanningElement } from "@/data/estatePlanningElements";
import {
  calculateFederalTax, calculateStateTax, calculateTotalTax,
  standardDeductions, stateNames, filingStatusLabels,
  getMarginalFederalRate, getMarginalStateRate,
  type FilingStatus,
} from "@/data/taxRates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ClipboardList, TrendingUp, DollarSign, Info } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AssessmentData } from "@/pages/Assessment";

const incomeToNumber: Record<string, number> = {
  under_75k: 50000,
  "75k_150k": 112500,
  "150k_300k": 225000,
  "300k_500k": 400000,
  "500k_1m": 750000,
  over_1m: 1500000,
};

const netWorthToNumber: Record<string, number> = {
  under_250k: 125000,
  "250k_1m": 625000,
  "1m_3m": 2000000,
  "3m_5m": 4000000,
  "5m_10m": 7500000,
  over_10m: 15000000,
};

const categoryStyles: Record<Category, string> = {
  charitable: "bg-charitable text-charitable-foreground",
  personal: "bg-personal text-personal-foreground",
  qualified: "bg-qualified text-qualified-foreground",
};

const categoryBorder: Record<Category, string> = {
  charitable: "border-l-charitable",
  personal: "border-l-personal",
  qualified: "border-l-qualified",
};

const deductionTypeLabels: Record<string, string> = {
  income_deduction: "Income Deduction",
  estate_reduction: "Estate Reduction",
  tax_credit: "Tax Credit",
  tax_deferred: "Tax Deferred",
  none: "No Direct Tax Impact",
};

function getRecommendations(data: AssessmentData): { element: EstatePlanningElement; score: number; reasons: string[] }[] {
  const income = incomeToNumber[data.annualIncome] || 0;
  const netWorth = netWorthToNumber[data.netWorth] || 0;

  return estatePlanningElements
    .map((el) => {
      let score = 0;
      const reasons: string[] = [];

      const goalMatches = el.relevantGoals.filter((g) => data.goals.includes(g));
      score += goalMatches.length * 30;
      goalMatches.forEach((g) => reasons.push(`Supports your goal: ${goalLabels[g]}`));

      if (el.relevantForIncomeAbove && income >= el.relevantForIncomeAbove) {
        score += 20;
        reasons.push("Suitable for your income level");
      } else if (el.relevantForIncomeAbove && income < el.relevantForIncomeAbove) {
        score -= 15;
      }

      if (el.relevantForNetWorthAbove !== undefined && netWorth >= el.relevantForNetWorthAbove) {
        score += 20;
        reasons.push("Appropriate for your net worth");
      } else if (el.relevantForNetWorthAbove && netWorth < el.relevantForNetWorthAbove) {
        score -= 15;
      }

      return { element: el, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + "%";
}

export default function Recommendations() {
  const raw = localStorage.getItem("assessmentData");
  const data: AssessmentData | null = raw ? JSON.parse(raw) : null;

  const defaultIncome = data ? (incomeToNumber[data.annualIncome] || 0) : 0;
  const [exactIncome, setExactIncome] = useState<number>(defaultIncome);
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const filingStatus = (data?.filingStatus || "single") as FilingStatus;
  const stateCode = data?.state || "";

  const recommendations = useMemo(() => {
    if (!data) return [];
    return getRecommendations(data);
  }, [data]);

  const setAllocation = useCallback((symbol: string, amount: number) => {
    setAllocations((prev) => ({ ...prev, [symbol]: amount }));
  }, []);

  // Tax calculations
  const taxCalc = useMemo(() => {
    const grossIncome = exactIncome;
    const stdDeduction = standardDeductions[filingStatus];

    // Calculate total income deductions from strategies
    let totalIncomeDeductions = 0;
    let hasCharitableDeductions = false;
    let totalCharitableDeductions = 0;

    recommendations.forEach(({ element }) => {
      const amount = allocations[element.symbol] || 0;
      if (amount <= 0) return;

      if (element.deductionType === "income_deduction") {
        if (element.category === "charitable") {
          hasCharitableDeductions = true;
          const deductible = element.deductionPercentage
            ? amount * element.deductionPercentage
            : amount;
          // Charitable deductions capped at 60% of AGI for cash
          const cap = grossIncome * 0.6;
          totalCharitableDeductions += Math.min(deductible, cap);
        } else {
          // Retirement / other deductions (above-the-line)
          const maxed = element.maxContribution ? Math.min(amount, element.maxContribution) : amount;
          totalIncomeDeductions += maxed;
        }
      }
    });

    // AGI after above-the-line deductions (retirement contributions)
    const agi = Math.max(0, grossIncome - totalIncomeDeductions);

    // Determine standard vs itemized
    // If charitable deductions exceed standard deduction, use itemized
    const saltCap = 10000;
    const itemizedTotal = totalCharitableDeductions + saltCap; // simplified
    const useItemized = hasCharitableDeductions && itemizedTotal > stdDeduction;
    const deductionUsed = useItemized ? itemizedTotal : stdDeduction;

    // Taxable income BEFORE strategies
    const taxableIncomeBefore = Math.max(0, grossIncome - stdDeduction);
    const taxBefore = calculateTotalTax(taxableIncomeBefore, stateCode, filingStatus);

    // Taxable income AFTER strategies
    const taxableIncomeAfter = Math.max(0, agi - deductionUsed);
    const taxAfter = calculateTotalTax(taxableIncomeAfter, stateCode, filingStatus);

    // Tax credit strategies
    let totalCredits = 0;
    recommendations.forEach(({ element }) => {
      const amount = allocations[element.symbol] || 0;
      if (element.deductionType === "tax_credit" && amount > 0) {
        totalCredits += amount;
      }
    });

    const finalTaxAfter = Math.max(0, taxAfter.total - totalCredits);
    const totalSavings = taxBefore.total - finalTaxAfter;

    const effectiveRateBefore = grossIncome > 0 ? taxBefore.total / grossIncome : 0;
    const effectiveRateAfter = grossIncome > 0 ? finalTaxAfter / grossIncome : 0;

    return {
      grossIncome,
      taxableIncomeBefore,
      taxableIncomeAfter,
      taxBefore,
      taxAfter: { federal: taxAfter.federal, state: taxAfter.state, total: finalTaxAfter },
      totalSavings,
      effectiveRateBefore,
      effectiveRateAfter,
      useItemized,
      deductionUsed,
      marginalFederalRate: getMarginalFederalRate(taxableIncomeBefore, filingStatus),
      marginalStateRate: getMarginalStateRate(taxableIncomeBefore, stateCode),
    };
  }, [exactIncome, allocations, recommendations, filingStatus, stateCode]);

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold font-serif mb-2">No Assessment Found</h1>
        <p className="text-muted-foreground mb-6">
          Complete the personal assessment first to receive tailored recommendations.
        </p>
        <Link to="/assessment">
          <Button>
            Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const totalAllocated = Object.values(allocations).reduce((s, v) => s + (v || 0), 0);

  const chartData = [
    { name: "Before", federal: taxCalc.taxBefore.federal, state: taxCalc.taxBefore.state },
    { name: "After", federal: taxCalc.taxAfter.federal, state: taxCalc.taxAfter.state },
  ];

  return (
    <div className="container py-12 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
          Tax Savings Calculator
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter dollar amounts for each strategy to see your real-time tax savings.
        </p>
      </div>

      {/* Current situation summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Location & Filing</p>
            <p className="font-bold font-serif">{stateNames[stateCode] || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{filingStatusLabels[filingStatus]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Gross Income</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={exactIncome || ""}
                onChange={(e) => setExactIncome(Number(e.target.value) || 0)}
                className="h-8 font-bold text-lg"
                placeholder="Enter exact income"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Marginal rate: {formatPercent(taxCalc.marginalFederalRate)} fed + {formatPercent(taxCalc.marginalStateRate)} state
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Current Tax (Before Strategies)</p>
            <p className="font-bold font-serif text-lg">{formatCurrency(taxCalc.taxBefore.total)}</p>
            <p className="text-xs text-muted-foreground">
              Fed: {formatCurrency(taxCalc.taxBefore.federal)} · State: {formatCurrency(taxCalc.taxBefore.state)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy cards */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{recommendations.length} strategies recommended</p>
        <Link to="/assessment">
          <Button variant="outline" size="sm">Update Assessment</Button>
        </Link>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No strong matches found. Try updating your assessment.</p>
          <Link to="/assessment">
            <Button variant="outline" className="mt-4">Retake Assessment</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 mb-10">
          {recommendations.map(({ element, score, reasons }, i) => {
            const amount = allocations[element.symbol] || 0;
            const canInput = element.deductionType !== "none";

            // Estimate individual savings at marginal rate
            let individualSavings = 0;
            if (amount > 0 && element.deductionType === "income_deduction") {
              const effectiveAmount = element.deductionPercentage
                ? amount * element.deductionPercentage
                : (element.maxContribution ? Math.min(amount, element.maxContribution) : amount);
              individualSavings = effectiveAmount * (taxCalc.marginalFederalRate + taxCalc.marginalStateRate);
            } else if (amount > 0 && element.deductionType === "tax_credit") {
              individualSavings = amount;
            }

            return (
              <motion.div
                key={element.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Card className={`border-l-4 ${categoryBorder[element.category]}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className={`shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold font-serif text-sm ${categoryStyles[element.category]}`}>
                        {element.symbol}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold font-serif text-base">{element.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[element.category]}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {deductionTypeLabels[element.deductionType]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{element.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {reasons.map((r) => (
                            <span key={r} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              {r}
                            </span>
                          ))}
                        </div>

                        {canInput && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Allocation Amount
                                {element.maxContribution && (
                                  <span className="ml-1">(max {formatCurrency(element.maxContribution)})</span>
                                )}
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                <Input
                                  type="number"
                                  value={amount || ""}
                                  onChange={(e) => setAllocation(element.symbol, Number(e.target.value) || 0)}
                                  className="pl-7 h-9"
                                  placeholder="0"
                                  max={element.maxContribution}
                                />
                              </div>
                            </div>
                            {amount > 0 && (
                              <div className="text-right sm:text-left">
                                <p className="text-xs text-muted-foreground">Est. Tax Savings</p>
                                <p className="font-bold text-personal font-serif">
                                  {formatCurrency(individualSavings)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {element.deductionType === "none" && (
                          <p className="text-xs text-muted-foreground italic mt-2">
                            This strategy provides non-tax benefits (asset protection, probate avoidance, etc.)
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary dashboard */}
      {totalAllocated > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-2 border-personal/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold font-serif mb-6 text-center">Tax Savings Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Before Strategies</p>
                  <p className="text-2xl font-bold font-serif">{formatCurrency(taxCalc.taxBefore.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    Effective rate: {formatPercent(taxCalc.effectiveRateBefore)}
                  </p>
                </div>
                <div className="text-center p-4 bg-personal/10 rounded-lg border border-personal/20">
                  <p className="text-sm text-muted-foreground mb-1">After Strategies</p>
                  <p className="text-2xl font-bold font-serif">{formatCurrency(taxCalc.taxAfter.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    Effective rate: {formatPercent(taxCalc.effectiveRateAfter)}
                  </p>
                </div>
                <div className="text-center p-4 bg-personal/20 rounded-lg border border-personal/30">
                  <p className="text-sm text-muted-foreground mb-1">Total Tax Savings</p>
                  <p className="text-3xl font-bold font-serif text-personal">
                    {formatCurrency(taxCalc.totalSavings)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {taxCalc.totalSavings > 0 && `${formatPercent(taxCalc.totalSavings / taxCalc.grossIncome)} of income`}
                  </p>
                </div>
              </div>

              {/* Bar chart */}
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={8}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <RechartsTooltip
                      formatter={(value: number, name: string) => [formatCurrency(value), name === "federal" ? "Federal" : "State"]}
                    />
                    <Bar dataKey="federal" stackId="a" fill="hsl(var(--primary))" name="Federal" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="state" stackId="a" fill="hsl(var(--accent))" name="State" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
                <span>Deduction method: {taxCalc.useItemized ? "Itemized" : "Standard"} ({formatCurrency(taxCalc.deductionUsed)})</span>
                <span>Total allocated: {formatCurrency(totalAllocated)}</span>
                {taxCalc.useItemized && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        <Info className="h-3 w-3" /> SALT cap applied ($10,000)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">State and local tax deduction is capped at $10,000 for federal purposes.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
