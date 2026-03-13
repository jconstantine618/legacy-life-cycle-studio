import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Compass, Loader2, Save, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import LifecycleVisualizer from "@/components/LifecycleVisualizer";
import {
  domains,
  guidedPromptGroups,
  horizonOptions,
  layoutLabels,
  priorityOptions,
  scenarioTemplates,
  worldviewLabels,
  type MapLayout,
  type Worldview,
} from "@/data/lifecycle";
import { buildLifecycleRoadmap, type LifecycleProfile } from "@/lib/lifecycleEngine";
import { useLifecycleProfile } from "@/hooks/useLifecycleProfile";
import { useToast } from "@/hooks/use-toast";

function TogglePill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function Assessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    profile,
    setProfile,
    saving,
    saveToSupabase,
    resetProfile,
    isAuthenticated,
    loading: profileLoading,
  } = useLifecycleProfile();

  const roadmap = useMemo(() => buildLifecycleRoadmap(profile), [profile]);

  const completion = useMemo(() => {
    const sections = [
      profile.age > 0 && profile.worldview && profile.preferredLayout,
      profile.occupation.trim() && profile.passions.trim() && profile.futureVision.trim(),
      profile.selectedDomains.length >= 2 && profile.priorities.length >= 2,
      profile.horizon && profile.energy > 0 && profile.transitionConfidence > 0 && profile.scenario.trim(),
    ];

    return (sections.filter(Boolean).length / sections.length) * 100;
  }, [profile]);

  const toggleArrayValue = (field: "priorities" | "selectedDomains", value: string) => {
    setProfile((current) => {
      const items = current[field];
      const nextItems = items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value];

      return {
        ...current,
        [field]: nextItems,
      } as LifecycleProfile;
    });
  };

  const handleSave = async () => {
    if (isAuthenticated) {
      await saveToSupabase(profile);
      toast({
        title: "Profile saved",
        description: "Your lifecycle profile has been saved to your account.",
      });
    }
    navigate("/roadmap");
  };

  const handleReset = () => {
    resetProfile();
  };

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(246,239,228,0.9)_48%,_rgba(238,230,218,1)_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
      <div className="container relative py-12 md:py-16">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Lifecycle profiler</p>
            <h1 className="mt-3 font-serif text-4xl text-slate-950 md:text-5xl">
              Give the app enough of your life to reason with
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              This is no longer just a season selector. It now asks about your work, passions, history, future, and
              the specific life situation you are trying to navigate so the roadmap can respond more intelligently.
            </p>
          </div>

          <Card className="w-full max-w-md border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Profile completion</span>
                <span className="font-semibold text-slate-900">{Math.round(completion)}%</span>
              </div>
              <Progress value={completion} className="h-2 bg-slate-200" />
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-[#ecf7e8] p-3">
                  <p className="text-slate-500">Season</p>
                  <p className="mt-2 font-semibold text-slate-900">{roadmap.season.name}</p>
                </div>
                <div className="rounded-2xl bg-[#e4f0fb] p-3">
                  <p className="text-slate-500">Readiness</p>
                  <p className="mt-2 font-semibold text-slate-900">{roadmap.readinessScore}/100</p>
                </div>
                <div className="rounded-2xl bg-[#f8efd7] p-3">
                  <p className="text-slate-500">Scenario</p>
                  <p className="mt-2 font-semibold text-slate-900">{roadmap.scenarioGuidance.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#ecf7e8] p-3 text-[#2f6b2f]">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-slate-950">Core frame</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">Age, worldview, and preferred geometry of the map.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <Label className="text-sm font-semibold text-slate-700">Current age</Label>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                        {profile.age}
                      </span>
                    </div>
                    <Slider
                      value={[profile.age]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => setProfile((current) => ({ ...current, age: value }))}
                    />
                    <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-slate-700">Worldview</Label>
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(worldviewLabels) as Worldview[]).map((worldview) => (
                        <TogglePill
                          key={worldview}
                          active={profile.worldview === worldview}
                          onClick={() => setProfile((current) => ({ ...current, worldview }))}
                        >
                          {worldviewLabels[worldview]}
                        </TogglePill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-slate-700">Map layout</Label>
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(layoutLabels) as MapLayout[]).map((layout) => (
                        <TogglePill
                          key={layout}
                          active={profile.preferredLayout === layout}
                          onClick={() => setProfile((current) => ({ ...current, preferredLayout: layout }))}
                        >
                          {layoutLabels[layout]}
                        </TogglePill>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }}>
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#f7efe6] p-3 text-[#7b4b25]">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-slate-950">Life context</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Add enough biography and aspiration for the app to interpret your season well.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-7">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="occupation" className="text-sm font-semibold text-slate-700">
                        What do you do for a living?
                      </Label>
                      <Input
                        id="occupation"
                        value={profile.occupation}
                        onChange={(event) => setProfile((current) => ({ ...current, occupation: event.target.value }))}
                        placeholder="I run a business, teach, work in medicine, recently retired, or I am in transition."
                        className="border-slate-200 bg-white/80"
                      />
                      <p className="text-xs leading-6 text-slate-500">
                        Prompt: what fills most of your week, and what part of that work still feels meaningful or burdensome?
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="passions" className="text-sm font-semibold text-slate-700">
                        What are you passionate about?
                      </Label>
                      <Input
                        id="passions"
                        value={profile.passions}
                        onChange={(event) => setProfile((current) => ({ ...current, passions: event.target.value }))}
                        placeholder="Mentoring, building, creating, caregiving, hospitality, faith, service, art, teaching."
                        className="border-slate-200 bg-white/80"
                      />
                      <p className="text-xs leading-6 text-slate-500">
                        Prompt: what naturally gets your care, attention, and energy even when nobody is asking for it?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="futureVision" className="text-sm font-semibold text-slate-700">
                      What do you think your future looks like?
                    </Label>
                    <Textarea
                      id="futureVision"
                      value={profile.futureVision}
                      onChange={(event) => setProfile((current) => ({ ...current, futureVision: event.target.value }))}
                      placeholder="I want more family time, less constant pressure, and a future where I am useful without being consumed."
                      className="min-h-24 border-slate-200 bg-white/80"
                    />
                    <p className="text-xs leading-6 text-slate-500">
                      Prompt: what do you hope increases, what do you hope decreases, and what are you afraid could happen if you drift?
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="backgroundSummary" className="text-sm font-semibold text-slate-700">
                      What background should this plan understand?
                    </Label>
                    <Textarea
                      id="backgroundSummary"
                      value={profile.backgroundSummary}
                      onChange={(event) => setProfile((current) => ({ ...current, backgroundSummary: event.target.value }))}
                      placeholder="I am supporting aging parents, my kids are becoming adults, work has shaped my identity, and I have not fully processed recent losses."
                      className="min-h-28 border-slate-200 bg-white/80"
                    />
                    <p className="text-xs leading-6 text-slate-500">
                      Prompt: mention important relationships, responsibilities, losses, turning points, or life history that make this season what it is.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {guidedPromptGroups.map((group) => (
                      <div key={group.id} className="rounded-3xl border border-slate-200 bg-[#faf6ef] p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{group.title}</p>
                        <div className="mt-3 space-y-2">
                          {group.prompts.map((prompt) => (
                            <p key={prompt} className="text-sm leading-6 text-slate-600">
                              {prompt}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#f4eadf] p-3 text-[#6e4f2e]">
                      <TimerReset className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-slate-950">Situation navigator</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Put the real question or crisis into words so the app can help think through next steps.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-slate-700">Common scenarios</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {scenarioTemplates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setProfile((current) => ({ ...current, scenario: template.prompt }))}
                          className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-left transition hover:border-slate-300"
                        >
                          <span className="block font-semibold text-slate-900">{template.title}</span>
                          <span className="mt-2 block text-sm leading-6 text-slate-500">{template.summary}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scenario" className="mb-3 block text-sm font-semibold text-slate-700">
                      Describe the situation you want help thinking through
                    </Label>
                    <Textarea
                      id="scenario"
                      value={profile.scenario}
                      onChange={(event) => setProfile((current) => ({ ...current, scenario: event.target.value }))}
                      placeholder="I don't know when to retire. I am tired, but I still feel responsible for the business and I do not know what life after work is supposed to look like."
                      className="min-h-28 border-slate-200 bg-white/80"
                    />
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Prompt: what is the actual tension, why is it hard right now, and what kind of clarity would make the next step easier?
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.45 }}>
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#e4f0fb] p-3 text-[#215d8d]">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-slate-950">Current pressure points</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        What needs attention in this season, and how much capacity is available?
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-7">
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-slate-700">Focus domains</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {domains.map((domain) => (
                        <label
                          key={domain.id}
                          className="flex cursor-pointer items-start gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 transition hover:border-slate-300"
                        >
                          <Checkbox
                            checked={profile.selectedDomains.includes(domain.id)}
                            onCheckedChange={() => toggleArrayValue("selectedDomains", domain.id)}
                          />
                          <span>
                            <span className="block font-semibold text-slate-900">{domain.name}</span>
                            <span className="mt-1 block text-sm leading-6 text-slate-500">{domain.summary}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-slate-700">Planning priorities</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {priorityOptions.map((priority) => (
                        <label
                          key={priority.id}
                          className="flex cursor-pointer items-start gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 transition hover:border-slate-300"
                        >
                          <Checkbox
                            checked={profile.priorities.includes(priority.id)}
                            onCheckedChange={() => toggleArrayValue("priorities", priority.id)}
                          />
                          <span>
                            <span className="block font-semibold text-slate-900">{priority.label}</span>
                            <span className="mt-1 block text-sm leading-6 text-slate-500">{priority.summary}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-700">Energy capacity</Label>
                        <span className="text-sm font-semibold text-slate-900">{profile.energy}/5</span>
                      </div>
                      <Slider
                        value={[profile.energy]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={([value]) => setProfile((current) => ({ ...current, energy: value }))}
                      />
                    </div>
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-700">Transition confidence</Label>
                        <span className="text-sm font-semibold text-slate-900">{profile.transitionConfidence}/5</span>
                      </div>
                      <Slider
                        value={[profile.transitionConfidence]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={([value]) => setProfile((current) => ({ ...current, transitionConfidence: value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#f8efd7] p-3 text-[#87600d]">
                      <TimerReset className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-slate-950">Planning horizon</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Decide whether the roadmap should act like an operating plan or a transition plan.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {horizonOptions.map((option) => (
                      <TogglePill
                        key={option.id}
                        active={profile.horizon === option.id}
                        onClick={() => setProfile((current) => ({ ...current, horizon: option.id }))}
                      >
                        {option.label}
                      </TogglePill>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="notes" className="mb-3 block text-sm font-semibold text-slate-700">
                      Context notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={profile.notes}
                      onChange={(event) => setProfile((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Add any further nuance: family complexity, faith questions, career uncertainty, health shifts, financial pressure, or unresolved conversations."
                      className="min-h-32 border-slate-200 bg-white/80"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={handleSave} size="lg" className="rounded-full px-6" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Build my roadmap
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg" className="rounded-full bg-white/80">
                      Reset sample profile
                    </Button>
                    {isAuthenticated && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Save className="h-3 w-3" />
                        Saving to your account
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <LifecycleVisualizer
              age={profile.age}
              worldview={profile.worldview}
              layout={profile.preferredLayout}
              highlightSeasonId={roadmap.season.id}
            />

            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live preview</p>
                <h2 className="mt-2 font-serif text-3xl text-slate-950">{roadmap.season.name} snapshot</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{roadmap.profileNarrative}</p>

                <div className="mt-5 rounded-3xl bg-[#f7f2ea] p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live situation</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {profile.scenario.trim() || "Add a real-life situation so the roadmap can respond with clearer next steps."}
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  {roadmap.signals.map((signal) => (
                    <div key={signal.title} className="rounded-3xl border border-slate-200 bg-white/75 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{signal.title}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                            signal.tone === "strong"
                              ? "bg-[#e7f7ea] text-[#2f6b2f]"
                              : signal.tone === "steady"
                                ? "bg-[#edf4fb] text-[#215d8d]"
                                : "bg-[#fdf0ea] text-[#8a4a22]"
                          }`}
                        >
                          {signal.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{signal.summary}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
