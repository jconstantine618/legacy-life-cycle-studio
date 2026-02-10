import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, User } from "lucide-react";
import type { AssessmentData } from "@/pages/Assessment";

export default function LeadCapture() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update profile with lead info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Save assessment data to DB
      const raw = localStorage.getItem("assessmentData");
      if (!raw) {
        navigate("/assessment");
        return;
      }

      const data: AssessmentData = JSON.parse(raw);

      // Upsert assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .insert({
          user_id: user.id,
          annual_income: data.annualIncome,
          net_worth: data.netWorth,
          state: data.state,
          filing_status: data.filingStatus,
          asset_types: data.assetTypes,
          goals: data.goals,
          existing_plans: data.existingPlans,
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Store assessment ID for recommendations page
      localStorage.setItem("currentAssessmentId", assessment.id);

      // Save strategy allocations if any exist
      const allocationsRaw = localStorage.getItem("strategyAllocations");
      if (allocationsRaw) {
        const allocations: Record<string, number> = JSON.parse(allocationsRaw);
        const rows = Object.entries(allocations)
          .filter(([_, amount]) => amount > 0)
          .map(([symbol, amount]) => ({
            assessment_id: assessment.id,
            strategy_symbol: symbol,
            dollar_amount: amount,
          }));

        if (rows.length > 0) {
          const { error: allocError } = await supabase
            .from("strategy_allocations")
            .insert(rows);
          if (allocError) throw allocError;
        }
      }

      toast({ title: "Saved!", description: "Your information has been saved." });
      navigate("/recommendations");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-20">
      <Card>
        <CardHeader className="text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <CardTitle className="font-serif text-2xl">Almost There!</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your contact information to receive your personalized tax savings analysis.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                required
                maxLength={20}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Email: {user?.email}
            </div>
            <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
              {loading ? "Saving..." : "View My Tax Savings"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
