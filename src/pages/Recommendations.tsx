import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LifecycleVisualizer from "@/components/LifecycleVisualizer";
import PdfLibrary from "@/components/PdfLibrary";
import { horizonOptions } from "@/data/lifecycle";
import { buildLifecycleRoadmap } from "@/lib/lifecycleEngine";
import { useLifecycleProfile } from "@/hooks/useLifecycleProfile";
import { useScenarioSessions } from "@/hooks/useScenarioSessions";

export default function Recommendations() {
  const { profile, remoteId } = useLifecycleProfile();
  const { saveSession, isAuthenticated } = useScenarioSessions();
  const roadmap = useMemo(() => buildLifecycleRoadmap(profile), [profile]);
  const activeHorizon = horizonOptions.find((option) => option.id === profile.horizon);
  const savedRef = useRef(false);

  // Auto-save scenario session for authenticated users on first load
  useEffect(() => {
    if (!isAuthenticated || savedRef.current || !profile.scenario.trim()) return;
    savedRef.current = true;
    saveSession({
      scenario: profile.scenario,
      guidance: roadmap.scenarioGuidance,
      lifecycleProfileId: remoteId,
    });
  }, [isAuthenticated, profile.scenario, roadmap.scenarioGuidance, remoteId, saveSession]);

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f6efe4_0%,#fbf8f2_45%,#f5ede2_100%)]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_60%)]" />
      <div className="container relative py-12 md:py-16">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Personalized roadmap</p>
            <h1 className="mt-3 font-serif text-4xl text-slate-950 md:text-5xl">
              A dynamic plan for the {roadmap.season.name.toLowerCase()} season of life
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{roadmap.profileNarrative}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="outline" className="rounded-full bg-white/80">
              <Link to="/profile">Edit profile</Link>
            </Button>
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => {
                window.print();
              }}
            >
              Print summary
              <Printer className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="space-y-6">
            <LifecycleVisualizer
              age={profile.age}
              worldview={profile.worldview}
              layout={profile.preferredLayout}
              highlightSeasonId={roadmap.season.id}
            />

            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Life context</p>
                <h2 className="mt-2 font-serif text-3xl text-slate-950">What this roadmap knows about you</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-[#f7f2ea] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Work</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {profile.occupation || "No work context added yet."}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#f7f2ea] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Passions</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {profile.passions || "No passion context added yet."}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#f7f2ea] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Future vision</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {profile.futureVision || "No future vision added yet."}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#f7f2ea] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Background</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {profile.backgroundSummary || "No background summary added yet."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roadmap.signals.map((signal) => (
                <Card key={signal.title} className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500">{signal.title}</p>
                    <p className="mt-3 font-serif text-3xl text-slate-950">{signal.value}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{signal.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Roadmap horizon</p>
                    <h2 className="mt-2 font-serif text-3xl text-slate-950">{activeHorizon?.label ?? "Active plan"}</h2>
                  </div>
                  <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    Readiness {roadmap.readinessScore}/100
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {roadmap.focusAreas.map((focus, index) => (
                    <motion.div
                      key={focus.domainId}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.45 }}
                      className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{focus.domainId}</p>
                      <h3 className="mt-3 font-serif text-2xl text-slate-950">{focus.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{focus.rationale}</p>
                      <div className="mt-5 space-y-3">
                        {focus.actions.map((action) => (
                          <div key={action} className="rounded-2xl bg-[#f7f2eb] p-3 text-sm leading-6 text-slate-700">
                            {action}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Situation analysis</p>
                <h2 className="mt-2 font-serif text-3xl text-slate-950">{roadmap.scenarioGuidance.label}</h2>
                <p className="mt-4 rounded-[1.5rem] bg-[#f7f2ea] p-4 text-sm leading-7 text-slate-700">
                  {profile.scenario || "No scenario entered yet."}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{roadmap.scenarioGuidance.summary}</p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Next steps</p>
                    <div className="mt-4 space-y-3">
                      {roadmap.scenarioGuidance.nextSteps.map((step) => (
                        <div key={step} className="rounded-2xl bg-[#f7f2eb] p-3 text-sm leading-6 text-slate-700">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Questions to ask</p>
                    <div className="mt-4 space-y-3">
                      {roadmap.scenarioGuidance.questions.map((question) => (
                        <div key={question} className="rounded-2xl bg-[#f7f2eb] p-3 text-sm leading-6 text-slate-700">
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Stabilize first</p>
                    <div className="mt-4 space-y-3">
                      {roadmap.scenarioGuidance.stabilizeFirst.map((item) => (
                        <div key={item} className="rounded-2xl bg-[#f7f2eb] p-3 text-sm leading-6 text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-slate-950 text-white shadow-[0_20px_60px_rgba(23,18,11,0.25)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-amber-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Reflection prompts</p>
                    <h2 className="mt-2 font-serif text-3xl">Questions that move this plan forward</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {roadmap.reflectionPrompts.map((prompt) => (
                    <div key={prompt} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/80">
                      {prompt}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <PdfLibrary worldview={profile.worldview} layout={profile.preferredLayout} />

            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Product direction</p>
                <h2 className="mt-2 font-serif text-3xl text-slate-950">What makes this more powerful than the original site</h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <p>
                    The original experience explains the model and offers printable charts. This application turns the
                    model into a usable planning workflow with a profile, live map, personalized focus areas, and an
                    exportable summary.
                  </p>
                  <p>
                    The next logical layer is persistence: save profiles for spouses, clients, or family members,
                    compare seasons side-by-side, and generate shareable plans, meeting agendas, or conversation guides.
                  </p>
                  <p>
                    After that, the roadmap can become collaborative with journaling, reminders, AI-generated prompts,
                    and document storage tied to each season.
                  </p>
                </div>
                <Button asChild size="lg" className="mt-6 rounded-full">
                  <Link to="/explorer">
                    Explore the lifecycle engine
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
