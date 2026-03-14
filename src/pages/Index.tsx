import { useCallback, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen, Compass } from "lucide-react";
import LifecycleVisualizer from "@/components/LifecycleVisualizer";
import { lifeCategories, activityOptions, activityCategories, sacredFraming, type Worldview } from "@/data/lifecycle";
import { buildLifeCoachInsight, type LifecycleProfile } from "@/lib/lifecycleEngine";
import { defaultLifecycleProfile, loadLifecycleProfile, saveLifecycleProfile } from "@/lib/lifecycleProfile";

export default function Index() {
  const [profile, setProfile] = useState<LifecycleProfile>(() => loadLifecycleProfile());
  const [showInsights, setShowInsights] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState(false);

  useEffect(() => {
    saveLifecycleProfile(profile);
  }, [profile]);

  const update = useCallback((patch: Partial<LifecycleProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateScore = useCallback((categoryId: string, value: number) => {
    setProfile((prev) => ({
      ...prev,
      scores: { ...prev.scores, [categoryId]: value },
    }));
  }, []);

  const toggleActivity = useCallback((activityId: string) => {
    setProfile((prev) => {
      const selected = prev.selectedActivities.includes(activityId)
        ? prev.selectedActivities.filter((id) => id !== activityId)
        : [...prev.selectedActivities, activityId];
      return { ...prev, selectedActivities: selected };
    });
  }, []);

  const insight = useMemo(() => {
    if (!showInsights) return null;
    return buildLifeCoachInsight(profile);
  }, [profile, showInsights]);

  const hasEnoughData =
    profile.occupation.trim().length > 0 ||
    Object.values(profile.scores).some((v) => v !== 5) ||
    profile.selectedActivities.length > 0;

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f5ecdf_0%,#fbf8f3_42%,#f3ece1_100%)]">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_58%)]" />
      <div className="container relative py-8 md:py-12 max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Life planning tool</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-slate-950 md:text-5xl">
            Legacy Life Cycle Studio
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            Answer a few simple questions about where you are in life. See your season, reflect on what matters, and get coached on what the next five years could look like.
          </p>
        </motion.div>

        {/* All inputs in a single column */}
        <div className="space-y-6">

          {/* Worldview Toggle */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-500">Framing</p>
              <div className="flex gap-3">
                {(["secular", "sacred"] as Worldview[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update({ worldview: option })}
                    className={`flex-1 rounded-full border px-4 py-3 text-sm font-medium transition ${
                      profile.worldview === option
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {option === "sacred" ? <BookOpen className="h-4 w-4" /> : <Compass className="h-4 w-4" />}
                      {option === "secular" ? "Secular" : "Christian"}
                    </span>
                  </button>
                ))}
              </div>
              {profile.worldview === "sacred" && (
                <p className="mt-3 text-xs italic text-slate-500">
                  "{sacredFraming.excerpt}" — {sacredFraming.verse}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Age & Lifespan */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">How old are you?</label>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
                    {profile.age}
                  </span>
                </div>
                <Slider
                  value={[profile.age]}
                  onValueChange={([v]) => update({ age: v })}
                  min={10}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    {profile.worldview === "sacred"
                      ? "When do you expect God to call you home?"
                      : "When do you expect your life to end?"}
                  </label>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
                    {profile.expectedLifespan}
                  </span>
                </div>
                <Slider
                  value={[profile.expectedLifespan]}
                  onValueChange={([v]) => update({ expectedLifespan: Math.max(profile.age + 1, v) })}
                  min={50}
                  max={110}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50</span>
                  <span>110</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {profile.expectedLifespan - profile.age} years remaining — that's{" "}
                  {Math.round((profile.expectedLifespan - profile.age) / 5)} more five-year chapters.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Occupation */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6">
              <label className="text-sm font-medium text-slate-700">What do you do?</label>
              <Input
                value={profile.occupation}
                onChange={(e) => update({ occupation: e.target.value })}
                placeholder="e.g., Software engineer, Teacher, Retired executive..."
                className="mt-2 bg-white/80"
              />
            </CardContent>
          </Card>

          {/* Life Category Sliders */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6">
              <p className="mb-1 text-xs uppercase tracking-[0.3em] text-slate-500">Life assessment</p>
              <p className="mb-5 text-sm text-slate-600">
                Rate each area of your life from 1 (struggling) to 10 (thriving).
              </p>
              <div className="space-y-5">
                {lifeCategories.map((category) => {
                  const value = profile.scores[category.id] ?? 5;
                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm text-slate-700">
                          <span className="mr-2">{category.icon}</span>
                          {category.question}
                        </label>
                        <span
                          className={`ml-3 min-w-[2rem] shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-bold ${
                            value >= 7
                              ? "bg-green-100 text-green-700"
                              : value >= 4
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => updateScore(category.id, v)}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Work & Rest Enjoyment */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  When you are working, what do you enjoy the most?
                </label>
                <Input
                  value={profile.workEnjoysMost}
                  onChange={(e) => update({ workEnjoysMost: e.target.value })}
                  placeholder="e.g., Solving problems, leading teams, helping customers..."
                  className="mt-2 bg-white/80"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  When you're not working, what do you enjoy the most?
                </label>
                <Input
                  value={profile.restEnjoysMost}
                  onChange={(e) => update({ restEnjoysMost: e.target.value })}
                  placeholder="e.g., Time with family, hiking, reading..."
                  className="mt-2 bg-white/80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity Selector */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Dream activities</p>
                  <p className="mt-1 text-sm text-slate-600">
                    If you could spend your time doing anything, what would you choose?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedActivities(!expandedActivities)}
                  className="ml-3 shrink-0 text-slate-500 hover:text-slate-700"
                >
                  {expandedActivities ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {profile.selectedActivities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.selectedActivities.map((id) => {
                    const act = activityOptions.find((a) => a.id === id);
                    if (!act) return null;
                    const cat = activityCategories.find((c) => c.id === act.category);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleActivity(id)}
                        className="rounded-full border px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-80"
                        style={{ backgroundColor: cat?.color ?? "#666", borderColor: cat?.color ?? "#666" }}
                      >
                        {act.label} ✕
                      </button>
                    );
                  })}
                </div>
              )}

              {expandedActivities && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  {activityCategories.map((cat) => {
                    const options = activityOptions.filter((a) => a.category === cat.id);
                    return (
                      <div key={cat.id}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                          {cat.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt) => {
                            const isSelected = profile.selectedActivities.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleActivity(opt.id)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                  isSelected
                                    ? "text-white"
                                    : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300"
                                }`}
                                style={
                                  isSelected ? { backgroundColor: cat.color, borderColor: cat.color } : undefined
                                }
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* ===== SEASON WHEEL ===== */}
          <div className="pt-4">
            <LifecycleVisualizer
              age={profile.age}
              expectedLifespan={profile.expectedLifespan}
              worldview={profile.worldview}
            />
          </div>

          {/* Timeline Bar */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-500">Your timeline</p>
              <div className="flex gap-0.5 overflow-hidden rounded-full">
                {Array.from({ length: Math.ceil(profile.expectedLifespan / 5) }, (_, i) => {
                  const segStart = i * 5;
                  const segEnd = Math.min(segStart + 5, profile.expectedLifespan);
                  const fraction = (segStart + segEnd) / 2 / profile.expectedLifespan;
                  let color: string;
                  if (fraction < 0.25) color = "#45b649";
                  else if (fraction < 0.5) color = "#0f75bd";
                  else if (fraction < 0.75) color = "#e6b718";
                  else color = "#736a67";

                  const isPast = segEnd <= profile.age;
                  const isCurrent = segStart <= profile.age && segEnd > profile.age;

                  return (
                    <div
                      key={i}
                      className="h-6 flex-1 relative transition-all"
                      style={{
                        backgroundColor: color,
                        opacity: isPast ? 0.4 : isCurrent ? 1 : 0.65,
                      }}
                      title={`${segStart}-${segEnd}`}
                    >
                      {isCurrent && (
                        <div className="absolute inset-0 border-2 border-white rounded-sm animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>Birth</span>
                <span className="font-semibold text-slate-600">You are here ({profile.age})</span>
                <span>{profile.expectedLifespan}</span>
              </div>
            </CardContent>
          </Card>

          {/* Generate Insights Button */}
          {!showInsights && (
            <Button
              onClick={() => setShowInsights(true)}
              size="lg"
              className="w-full rounded-full text-base py-6"
              disabled={!hasEnoughData && profile.age === 38}
            >
              {profile.worldview === "sacred" ? "Reveal My Season Guidance" : "Show My Life Coach Insights"}
            </Button>
          )}
        </div>

        {/* ===== INSIGHTS SECTION ===== */}
        {showInsights && insight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 space-y-8"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                {profile.worldview === "sacred" ? "Your Season Guidance" : "Your Life Coach Insights"}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-slate-950 md:text-4xl">
                {insight.currentSeason.name} Season — Age {profile.age}
              </h2>
            </div>

            {/* Narrative */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg leading-8 text-slate-700">{insight.narrative}</p>
                <div className="mt-6 grid gap-4 grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{insight.yearsLived}</p>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Years lived</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{insight.yearsRemaining}</p>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Years left</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">
                      {Math.round(insight.yearsRemaining / 5)}
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Chapters left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Growth */}
            {(insight.strengths.length > 0 || insight.growthAreas.length > 0) && (
              <div className="grid gap-6 md:grid-cols-2">
                {insight.strengths.length > 0 && (
                  <Card className="border-green-200/60 bg-green-50/50 shadow-md">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-green-600 mb-3">Where you're thriving</p>
                      <div className="space-y-2">
                        {insight.strengths.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm text-slate-700 capitalize">{s}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {insight.growthAreas.length > 0 && (
                  <Card className="border-amber-200/60 bg-amber-50/50 shadow-md">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-600 mb-3">Areas for growth</p>
                      <div className="space-y-2">
                        {insight.growthAreas.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-sm text-slate-700 capitalize">{s}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Next 5-Year Focus */}
            <Card className="border-white/60 bg-slate-950 text-white shadow-lg">
              <CardContent className="p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {profile.worldview === "sacred" ? "Your next chapter (ages " : "Your next 5 years (ages "}
                  {profile.age}-{profile.age + 5})
                </p>
                <h3 className="mt-2 font-serif text-2xl">What to focus on</h3>
                <div className="mt-6 space-y-4">
                  {insight.nextFiveYearFocus.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-7 text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection Prompts */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {profile.worldview === "sacred" ? "Questions for prayer & reflection" : "Questions for reflection"}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-slate-950">Sit with these</h3>
                <div className="mt-6 space-y-4">
                  {insight.reflectionPrompts.map((prompt, i) => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <p className="text-sm leading-7 text-slate-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Five-Year Segment Timeline */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Life at a glance</p>
                <h3 className="mt-2 font-serif text-2xl text-slate-950 mb-6">Your five-year chapters</h3>
                <div className="space-y-2">
                  {insight.fiveYearSegments.map((seg, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                        seg.isCurrent
                          ? "ring-2 ring-offset-1"
                          : seg.isPast
                            ? "opacity-50"
                            : "opacity-80"
                      }`}
                      style={{
                        backgroundColor: seg.season.colors.soft,
                        ...(seg.isCurrent ? { ringColor: seg.season.colors.solid } : {}),
                      }}
                    >
                      <span
                        className="w-14 text-xs font-bold"
                        style={{ color: seg.season.colors.ink }}
                      >
                        {seg.label}
                      </span>
                      <div
                        className="h-3 flex-1 rounded-full"
                        style={{
                          backgroundColor: seg.season.colors.solid,
                          opacity: seg.isPast ? 0.3 : seg.isCurrent ? 1 : 0.5,
                        }}
                      />
                      <span className="w-14 text-right text-xs" style={{ color: seg.season.colors.ink }}>
                        {seg.season.name}
                      </span>
                      {seg.isCurrent && (
                        <span className="text-xs font-bold whitespace-nowrap" style={{ color: seg.season.colors.ink }}>
                          ← You
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <div className="text-center pb-8">
              <Button
                onClick={() => {
                  setShowInsights(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                variant="outline"
                size="lg"
                className="rounded-full bg-white/80"
              >
                Update my answers
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
