import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import LifecycleVisualizer from "@/components/LifecycleVisualizer";
import PdfLibrary from "@/components/PdfLibrary";
import {
  sacredFraming,
  seasons,
  layoutLabels,
  worldviewLabels,
  type MapLayout,
  type Worldview,
} from "@/data/lifecycle";

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function Blueprint() {
  const [age, setAge] = useState(38);
  const [worldview, setWorldview] = useState<Worldview>("secular");
  const [layout, setLayout] = useState<MapLayout>("circle");

  const activeSeason = useMemo(
    () => seasons.find((season) => age >= season.ageRange[0] && age < season.ageRange[1]) ?? seasons[3],
    [age],
  );

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f5ede1_0%,#fbf8f3_40%,#f3ece1_100%)]">
      <div className="container relative py-12 md:py-16">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Explorer</p>
            <h1 className="mt-3 font-serif text-4xl text-slate-950 md:text-5xl">
              Explore the model behind the Legacy Life Cycle
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The original site gives visitors a static PDF. This explorer turns the concept into an interactive,
              age-aware experience with worldview and geometry toggles, season summaries, and embedded chart access.
            </p>
          </div>

          <Button asChild size="lg" className="rounded-full">
            <Link to="/profile">
              Profile a real person
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-6 lg:grid-cols-[0.74fr_0.26fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Interactive controls</p>
                    <h2 className="mt-2 font-serif text-3xl text-slate-950">Move through the lifespan</h2>
                    <div className="mt-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Age</span>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                          {age}
                        </span>
                      </div>
                      <Slider value={[age]} min={0} max={100} step={1} onValueChange={([value]) => setAge(value)} />
                      <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-700">Worldview</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(worldviewLabels) as Worldview[]).map((option) => (
                          <TogglePill key={option} active={worldview === option} onClick={() => setWorldview(option)}>
                            {worldviewLabels[option]}
                          </TogglePill>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-700">Layout</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(layoutLabels) as MapLayout[]).map((option) => (
                          <TogglePill key={option} active={layout === option} onClick={() => setLayout(option)}>
                            {layoutLabels[option]}
                          </TogglePill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <LifecycleVisualizer age={age} worldview={worldview} layout={layout} highlightSeasonId={activeSeason.id} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {seasons.map((season, index) => {
                const isActive = season.id === activeSeason.id;
                return (
                  <motion.div
                    key={season.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                  >
                    <Card className={`h-full border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)] ${isActive ? "ring-2 ring-slate-900/10" : ""}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{season.verb}</p>
                            <h3 className="mt-2 font-serif text-3xl" style={{ color: season.colors.ink }}>
                              {season.name}
                            </h3>
                          </div>
                          <div
                            className="rounded-full px-3 py-1 text-sm font-semibold"
                            style={{ backgroundColor: season.colors.soft, color: season.colors.ink }}
                          >
                            {season.ageRange[0]}-{season.ageRange[1]}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-600">{season.summary}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {season.descriptors.map((descriptor) => (
                            <span
                              key={descriptor}
                              className="rounded-full px-3 py-1 text-xs font-medium"
                              style={{ backgroundColor: season.colors.soft, color: season.colors.ink }}
                            >
                              {descriptor}
                            </span>
                          ))}
                        </div>
                        <p className="mt-5 rounded-3xl bg-[#f8f3ec] p-4 text-sm leading-6 text-slate-700">
                          {season.transitionPrompt}
                        </p>
                        {worldview === "sacred" && season.sacredAnchor ? (
                          <div className="mt-4 rounded-3xl border border-slate-200 bg-white/85 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{season.sacredAnchor.citation}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{season.sacredAnchor.excerpt}</p>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <PdfLibrary worldview={worldview} layout={layout} />

            {worldview === "sacred" ? (
              <Card className="border-white/60 bg-slate-950 text-white shadow-[0_20px_60px_rgba(23,18,11,0.25)]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3 text-amber-200">
                      <BookOpenText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Sacred framing</p>
                      <h2 className="mt-2 font-serif text-3xl">{sacredFraming.verse}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-white/75">{sacredFraming.excerpt}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Secular framing</p>
                  <h2 className="mt-2 font-serif text-3xl text-slate-950">A universal planning language</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    The secular mode keeps the seasonal structure while removing explicit scriptural framing. That makes
                    the concept easier to use in coaching, education, family conversations, and organizational planning.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
