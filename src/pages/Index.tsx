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
      <div className="relative px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">Life planning tool</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-slate-950 sm:text-4xl md:text-5xl">
            Legacy Life Cycle Studio
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
            Answer a few simple questions about where you are in life. See your season, reflect on what matters, and get coached on what the next five years could look like.
          </p>
        </motion.div>

        {/* All inputs in a single column */}
        <div className="space-y-4 sm:space-y-6">

          {/* Worldview Toggle */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <p className="mb-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Framing</p>
              <div className="flex gap-2 sm:gap-3">
                {(["secular", "sacred"] as Worldview[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update({ worldview: option })}
                    className={`flex-1 rounded-full border px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium transition ${
                      profile.worldview === option
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {option === "sacred" ? <BookOpen className="h-4 w-4" /> : <Compass className="h-4 w-4" />}
                      {option === "secular" ? "Secular" : "Christian"}
                    </span>
                  </button>
                ))}
              </div>
              {profile.worldview === "sacred" && (
                <p className="mt-3 text-[11px] sm:text-xs italic leading-5 text-slate-500">
                  "{sacredFraming.excerpt}" — {sacredFraming.verse}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Age & Lifespan */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-4 sm:p-6 space-y-6">
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
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  {profile.worldview === "sacred"
                    ? "When do you expect God to call you home?"
                    : "When do you expect your life to end?"}
                </label>
                <div className="flex items-center justify-end mb-1">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
                    Age {profile.expectedLifespan}
                  </span>
                </div>
                <Slider
                  value={[profile.expectedLifespan]}
                  onValueChange={([v]) => update({ expectedLifespan: Math.max(profile.age + 1, v) })}
                  min={50}
                  max={110}
                  step={1}
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
            <CardContent className="p-4 sm:p-6">
              <label className="text-sm font-medium text-slate-700">What do you do?</label>
              <Input
                value={profile.occupation}
                onChange={(e) => update({ occupation: e.target.value })}
                placeholder="e.g., Teacher, Engineer, Retired..."
                className="mt-2 bg-white/80 h-11"
              />
            </CardContent>
          </Card>

          {/* Life Category Sliders */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <p className="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Life assessment</p>
              <p className="mb-4 sm:mb-5 text-xs sm:text-sm text-slate-600">
                Rate each area from 1 (struggling) to 10 (thriving).
              </p>
              <div className="space-y-5">
                {lifeCategories.map((category) => {
                  const value = profile.scores[category.id] ?? 5;
                  return (
                    <div key={category.id}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <label className="text-[13px] sm:text-sm leading-5 text-slate-700">
                          <span className="mr-1.5">{category.icon}</span>
                          {category.question}
                        </label>
                        <span
                          className={`ml-2 min-w-[1.75rem] shrink-0 rounded-full px-1.5 py-0.5 text-center text-xs font-bold ${
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
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  When working, what do you enjoy most?
                </label>
                <Input
                  value={profile.workEnjoysMost}
                  onChange={(e) => update({ workEnjoysMost: e.target.value })}
                  placeholder="e.g., Solving problems, leading teams..."
                  className="bg-white/80 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  When not working, what do you enjoy most?
                </label>
                <Input
                  value={profile.restEnjoysMost}
                  onChange={(e) => update({ restEnjoysMost: e.target.value })}
                  placeholder="e.g., Family time, hiking, reading..."
                  className="bg-white/80 h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity Selector */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <button
                type="button"
                onClick={() => setExpandedActivities(!expandedActivities)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Dream activities</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    If you could spend your time doing anything, what would you choose?
                  </p>
                </div>
                <span className="ml-3 shrink-0 text-slate-400">
                  {expandedActivities ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>

              {profile.selectedActivities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.selectedActivities.map((id) => {
                    const act = activityOptions.find((a) => a.id === id);
                    if (!act) return null;
                    const cat = activityCategories.find((c) => c.id === act.category);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleActivity(id)}
                        className="rounded-full border px-2.5 py-1 text-[11px] sm:text-xs font-medium text-white transition active:scale-95"
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
                        <p className="mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                          {cat.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {options.map((opt) => {
                            const isSelected = profile.selectedActivities.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleActivity(opt.id)}
                                className={`rounded-full border px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition active:scale-95 ${
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
          <div className="pt-2 sm:pt-4">
            <LifecycleVisualizer
              age={profile.age}
              expectedLifespan={profile.expectedLifespan}
              worldview={profile.worldview}
            />
          </div>

          {/* Timeline Bar */}
          <Card className="border-white/60 bg-white/75 shadow-md">
            <CardContent className="p-4 sm:p-5">
              <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Your timeline</p>
              <div className="flex gap-px overflow-hidden rounded-full">
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
                      className="h-5 sm:h-6 flex-1 relative transition-all"
                      style={{
                        backgroundColor: color,
                        opacity: isPast ? 0.35 : isCurrent ? 1 : 0.6,
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
              <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1.5">
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
              className="w-full rounded-full text-sm sm:text-base py-5 sm:py-6"
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
            className="mt-10 space-y-5 sm:space-y-8"
          >
            <div className="text-center">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">
                {profile.worldview === "sacred" ? "Your Season Guidance" : "Your Life Coach Insights"}
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-slate-950 md:text-4xl">
                {insight.currentSeason.name} Season — Age {profile.age}
              </h2>
            </div>

            {/* Narrative */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700">{insight.narrative}</p>
                <div className="mt-5 grid gap-3 grid-cols-3">
                  <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">{insight.yearsLived}</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Years lived</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">{insight.yearsRemaining}</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Years left</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-slate-50 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                      {Math.round(insight.yearsRemaining / 5)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Chapters left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Growth */}
            {(insight.strengths.length > 0 || insight.growthAreas.length > 0) && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {insight.strengths.length > 0 && (
                  <Card className="border-green-200/60 bg-green-50/50 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-green-600 mb-2 sm:mb-3">Where you're thriving</p>
                      <div className="space-y-1.5">
                        {insight.strengths.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
                            <span className="text-xs sm:text-sm text-slate-700 capitalize">{s}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {insight.growthAreas.length > 0 && (
                  <Card className="border-amber-200/60 bg-amber-50/50 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-600 mb-2 sm:mb-3">Areas for growth</p>
                      <div className="space-y-1.5">
                        {insight.growthAreas.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-500" />
                            <span className="text-xs sm:text-sm text-slate-700 capitalize">{s}</span>
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
              <CardContent className="p-4 sm:p-6 md:p-8">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/50">
                  {profile.worldview === "sacred" ? "Your next chapter (ages " : "Your next 5 years (ages "}
                  {profile.age}–{profile.age + 5})
                </p>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl">What to focus on</h3>
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {insight.nextFiveYearFocus.map((item, i) => (
                    <div key={i} className="flex gap-2.5 sm:gap-3">
                      <span className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] sm:text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection Prompts */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">
                  {profile.worldview === "sacred" ? "Questions for prayer & reflection" : "Questions for reflection"}
                </p>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl text-slate-950">Sit with these</h3>
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {insight.reflectionPrompts.map((prompt, i) => (
                    <div key={i} className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 p-3.5 sm:p-5">
                      <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Five-Year Segment Timeline */}
            <Card className="border-white/60 bg-white/75 shadow-lg">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">Life at a glance</p>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl text-slate-950 mb-4 sm:mb-6">Your five-year chapters</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {insight.fiveYearSegments.map((seg, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 transition ${
                        seg.isCurrent
                          ? "ring-2 ring-offset-1"
                          : seg.isPast
                            ? "opacity-45"
                            : "opacity-75"
                      }`}
                      style={{
                        backgroundColor: seg.season.colors.soft,
                        ...(seg.isCurrent ? { ringColor: seg.season.colors.solid } : {}),
                      }}
                    >
                      <span
                        className="w-11 sm:w-14 text-[10px] sm:text-xs font-bold"
                        style={{ color: seg.season.colors.ink }}
                      >
                        {seg.label}
                      </span>
                      <div
                        className="h-2.5 sm:h-3 flex-1 rounded-full"
                        style={{
                          backgroundColor: seg.season.colors.solid,
                          opacity: seg.isPast ? 0.3 : seg.isCurrent ? 1 : 0.5,
                        }}
                      />
                      <span className="w-11 sm:w-14 text-right text-[10px] sm:text-xs" style={{ color: seg.season.colors.ink }}>
                        {seg.season.name}
                      </span>
                      {seg.isCurrent && (
                        <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap" style={{ color: seg.season.colors.ink }}>
                          ← You
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <div className="text-center pb-6 sm:pb-8">
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
