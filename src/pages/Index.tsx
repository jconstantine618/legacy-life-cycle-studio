import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Compass, FileText, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LifecycleVisualizer from "@/components/LifecycleVisualizer";
import { pdfAssets, seasons, worldviewLabels, type Worldview } from "@/data/lifecycle";

const productLayers = [
  {
    title: "Interactive season map",
    description: "Move from a static PDF to a live age-aware interface with sacred and secular framing built in.",
    icon: Layers3,
  },
  {
    title: "Lifecycle profiler",
    description: "Capture age, transition pressure, domains, and planning horizon to create a tailored roadmap.",
    icon: Compass,
  },
  {
    title: "Canonical document vault",
    description: "Keep the original circle and arc PDFs accessible for printing, teaching, or client handoff.",
    icon: FileText,
  },
  {
    title: "AI-ready planning layer",
    description: "The concept can expand into guided prompts, journaling, reminders, and collaborative family planning.",
    icon: Sparkles,
  },
];

export default function Index() {
  const [worldview, setWorldview] = useState<Worldview>("secular");
  const activeSeason = useMemo(() => seasons[1], []);
  const recommendedAsset = useMemo(
    () => pdfAssets.find((asset) => asset.worldview === worldview && asset.layout === "circle") ?? pdfAssets[0],
    [worldview],
  );

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f5ecdf_0%,#fbf8f3_42%,#f3ece1_100%)]">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_58%)]" />
      <div className="container relative py-12 md:py-16">
        <section className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Digitized concept</p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 font-serif text-5xl leading-[1.05] text-slate-950 md:text-7xl"
            >
              Legacy Life Cycle as an actual product, not just a printable chart
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            >
              The source site is a strong idea wrapped in PDFs. This application turns it into an interactive planning
              engine: explore the lifecycle visually, profile a person or client, and generate a roadmap for the season
              they are actually living in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/explorer">
                  Explore the model
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/80 px-6">
                <Link to="/profile">Build a profile</Link>
              </Button>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">
              {(Object.keys(worldviewLabels) as Worldview[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWorldview(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    worldview === option
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/75 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {worldviewLabels[option]}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.55 }}>
            <Card className="overflow-hidden border-white/60 bg-white/70 shadow-[0_28px_80px_rgba(48,39,25,0.16)]">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live preview</p>
                    <h2 className="mt-2 font-serif text-3xl text-slate-950">Season-aware dashboard</h2>
                  </div>
                  <div className="rounded-full bg-[#f7f2ea] px-4 py-2 text-sm text-slate-600">
                    {recommendedAsset.title}
                  </div>
                </div>

                <LifecycleVisualizer age={38} worldview={worldview} layout="circle" highlightSeasonId={activeSeason.id} />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="mt-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Application shape</p>
            <h2 className="mt-3 font-serif text-4xl text-slate-950">What the powerful version should include</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The point is not to recreate the landing page. The point is to operationalize the framework so it can be
              used in coaching, family planning, education, and advisory work.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productLayers.map((layer, index) => {
              const Icon = layer.icon;

              return (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                >
                  <Card className="h-full border-white/60 bg-white/75 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
                    <CardContent className="p-6">
                      <div className="inline-flex rounded-2xl bg-[#f8f2e8] p-3 text-slate-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-serif text-3xl text-slate-950">{layer.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{layer.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <Card className="border-white/60 bg-slate-950 text-white shadow-[0_28px_80px_rgba(23,18,11,0.25)]">
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Upgrade path</p>
              <h2 className="mt-3 font-serif text-4xl">How this evolves into a serious platform</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-white/75">
                <p>Start with local profiles and PDF-backed exploration.</p>
                <p>Add accounts, saved household plans, and session notes.</p>
                <p>Then layer in AI prompts, collaborative planning, reminders, and exportable reports for advisors or families.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-white/75 shadow-[0_28px_80px_rgba(48,39,25,0.16)]">
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current prototype</p>
              <h2 className="mt-3 font-serif text-4xl text-slate-950">Built around the original materials</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The explorer and roadmap pages keep the source PDFs available, but the center of gravity shifts to
                interaction: choose a worldview, move through age, inspect the season logic, and generate a real plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/roadmap">
                    See the roadmap view
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full bg-white/80">
                  <Link to="/explorer">Review the source maps</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
