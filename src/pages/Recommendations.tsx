import { useMemo } from "react";
import { Link } from "react-router-dom";
import { estatePlanningElements, categoryLabels, goalLabels, type Category, type EstatePlanningElement } from "@/data/estatePlanningElements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
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

function getRecommendations(data: AssessmentData): { element: EstatePlanningElement; score: number; reasons: string[] }[] {
  const income = incomeToNumber[data.annualIncome] || 0;
  const netWorth = netWorthToNumber[data.netWorth] || 0;

  return estatePlanningElements
    .map((el) => {
      let score = 0;
      const reasons: string[] = [];

      // Goal matching
      const goalMatches = el.relevantGoals.filter((g) => data.goals.includes(g));
      score += goalMatches.length * 30;
      goalMatches.forEach((g) => reasons.push(`Supports your goal: ${goalLabels[g]}`));

      // Income relevance
      if (el.relevantForIncomeAbove && income >= el.relevantForIncomeAbove) {
        score += 20;
        reasons.push("Suitable for your income level");
      } else if (el.relevantForIncomeAbove && income < el.relevantForIncomeAbove) {
        score -= 15;
      }

      // Net worth relevance
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

export default function Recommendations() {
  const raw = localStorage.getItem("assessmentData");
  const data: AssessmentData | null = raw ? JSON.parse(raw) : null;

  const recommendations = useMemo(() => {
    if (!data) return [];
    return getRecommendations(data);
  }, [data]);

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

  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
          Your Personalized Recommendations
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Based on your assessment, here are the estate planning strategies that best match your situation and goals.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No strong matches found. Try updating your assessment with more details.</p>
          <Link to="/assessment">
            <Button variant="outline" className="mt-4">Retake Assessment</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{recommendations.length} strategies recommended</p>
            <Link to="/assessment">
              <Button variant="outline" size="sm">Update Assessment</Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {recommendations.map(({ element, score, reasons }, i) => (
              <motion.div
                key={element.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card className={`border-l-4 ${categoryBorder[element.category]}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className={`shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-lg font-bold font-serif text-lg ${categoryStyles[element.category]}`}>
                        {element.symbol}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold font-serif text-lg">{element.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[element.category]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{element.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {reasons.map((r) => (
                            <span key={r} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                              {r}
                            </span>
                          ))}
                        </div>
                        {element.estimatedSavingsRange && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <TrendingUp className="h-4 w-4 text-personal" />
                            <span className="font-medium">Est. Savings:</span>
                            <span className="text-personal font-semibold">{element.estimatedSavingsRange}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
