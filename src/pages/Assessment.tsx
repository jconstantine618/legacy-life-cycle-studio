import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AssessmentData {
  annualIncome: string;
  netWorth: string;
  assetTypes: string[];
  goals: string[];
  existingPlans: string[];
}

const defaultData: AssessmentData = {
  annualIncome: "",
  netWorth: "",
  assetTypes: [],
  goals: [],
  existingPlans: [],
};

const incomeRanges = [
  { value: "under_75k", label: "Under $75,000" },
  { value: "75k_150k", label: "$75,000 – $150,000" },
  { value: "150k_300k", label: "$150,000 – $300,000" },
  { value: "300k_500k", label: "$300,000 – $500,000" },
  { value: "500k_1m", label: "$500,000 – $1,000,000" },
  { value: "over_1m", label: "Over $1,000,000" },
];

const netWorthRanges = [
  { value: "under_250k", label: "Under $250,000" },
  { value: "250k_1m", label: "$250,000 – $1,000,000" },
  { value: "1m_3m", label: "$1,000,000 – $3,000,000" },
  { value: "3m_5m", label: "$3,000,000 – $5,000,000" },
  { value: "5m_10m", label: "$5,000,000 – $10,000,000" },
  { value: "over_10m", label: "Over $10,000,000" },
];

const assetOptions = [
  "Real Estate", "Stocks & Bonds", "Business Interests", "Retirement Accounts",
  "Life Insurance", "Cash & Savings", "Collectibles & Art", "Cryptocurrency",
];

const goalOptions = [
  { value: "tax_reduction", label: "Reduce Income & Estate Taxes" },
  { value: "wealth_transfer", label: "Transfer Wealth to Heirs" },
  { value: "charitable_giving", label: "Support Charitable Causes" },
  { value: "asset_protection", label: "Protect Assets from Creditors" },
];

const existingPlanOptions = [
  "Revocable Trust", "Irrevocable Trust", "Will", "Power of Attorney",
  "Life Insurance Policy", "401(k) / IRA", "Charitable Fund / Foundation",
  "Business Succession Plan",
];

const steps = ["Income & Assets", "Goals & Priorities", "Existing Plans"];

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(defaultData);
  const navigate = useNavigate();
  const progress = ((step + 1) / steps.length) * 100;

  const toggleArray = (field: keyof AssessmentData, value: string) => {
    setData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const canProceed = () => {
    if (step === 0) return data.annualIncome && data.netWorth;
    if (step === 1) return data.goals.length > 0;
    return true;
  };

  const handleSubmit = () => {
    // Store in localStorage for now; will move to DB with Cloud
    localStorage.setItem("assessmentData", JSON.stringify(data));
    navigate("/recommendations");
  };

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold font-serif text-center mb-2">
        Personal Assessment
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Answer a few questions to get personalized estate planning recommendations.
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          {steps.map((s, i) => (
            <span key={s} className={i === step ? "font-semibold text-foreground" : ""}>
              {s}
            </span>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">{steps[step]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 0 && (
                <>
                  <div className="space-y-3">
                    <Label className="font-semibold">Annual Household Income</Label>
                    <RadioGroup value={data.annualIncome} onValueChange={(v) => setData({ ...data, annualIncome: v })}>
                      {incomeRanges.map((r) => (
                        <div key={r.value} className="flex items-center gap-2">
                          <RadioGroupItem value={r.value} id={`inc-${r.value}`} />
                          <Label htmlFor={`inc-${r.value}`} className="font-normal cursor-pointer">{r.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">Estimated Net Worth</Label>
                    <RadioGroup value={data.netWorth} onValueChange={(v) => setData({ ...data, netWorth: v })}>
                      {netWorthRanges.map((r) => (
                        <div key={r.value} className="flex items-center gap-2">
                          <RadioGroupItem value={r.value} id={`nw-${r.value}`} />
                          <Label htmlFor={`nw-${r.value}`} className="font-normal cursor-pointer">{r.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold">Asset Types (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {assetOptions.map((a) => (
                        <div key={a} className="flex items-center gap-2">
                          <Checkbox
                            id={`asset-${a}`}
                            checked={data.assetTypes.includes(a)}
                            onCheckedChange={() => toggleArray("assetTypes", a)}
                          />
                          <Label htmlFor={`asset-${a}`} className="font-normal cursor-pointer text-sm">{a}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Label className="font-semibold">What are your primary goals? (select all that apply)</Label>
                  {goalOptions.map((g) => (
                    <div key={g.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`goal-${g.value}`}
                        checked={data.goals.includes(g.value)}
                        onCheckedChange={() => toggleArray("goals", g.value)}
                      />
                      <Label htmlFor={`goal-${g.value}`} className="font-normal cursor-pointer">{g.label}</Label>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <Label className="font-semibold">What plans do you already have in place? (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {existingPlanOptions.map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <Checkbox
                          id={`plan-${p}`}
                          checked={data.existingPlans.includes(p)}
                          onCheckedChange={() => toggleArray("existingPlans", p)}
                        />
                        <Label htmlFor={`plan-${p}`} className="font-normal cursor-pointer text-sm">{p}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button disabled={!canProceed()} onClick={() => setStep(step + 1)}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-gold text-gold-foreground hover:bg-gold/90">
            Get Recommendations <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
