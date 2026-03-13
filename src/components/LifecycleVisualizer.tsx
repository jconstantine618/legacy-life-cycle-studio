import { getScaledSeasons, type Worldview } from "@/data/lifecycle";

interface LifecycleVisualizerProps {
  age: number;
  expectedLifespan: number;
  worldview: Worldview;
}

function polarPosition(age: number, maxAge: number) {
  const fraction = Math.min(1, Math.max(0, age / maxAge));
  const angle = -90 + fraction * 360;
  const radians = (angle * Math.PI) / 180;
  const radius = 44;
  const x = 50 + radius * Math.cos(radians);
  const y = 50 + radius * Math.sin(radians);
  return { x, y };
}

export default function LifecycleVisualizer({
  age,
  expectedLifespan,
  worldview,
}: LifecycleVisualizerProps) {
  const scaledSeasons = getScaledSeasons(expectedLifespan);
  const currentSeason = scaledSeasons.find(
    (s) => age >= s.scaledRange[0] && age < s.scaledRange[1],
  ) ?? scaledSeasons[scaledSeasons.length - 1];
  const marker = polarPosition(age, expectedLifespan);

  return (
    <div className="rounded-[2rem] border border-white/50 bg-white/55 p-5 shadow-[0_24px_60px_rgba(57,47,35,0.12)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Your life map</p>
          <h2 className="font-serif text-2xl text-slate-900">Season Wheel</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
          {worldview === "sacred" ? "Sacred framing" : "Secular framing"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
          <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-inner" />
          <div className="absolute inset-4 overflow-hidden rounded-full">
            <div className="grid h-full grid-cols-2 grid-rows-2">
              {scaledSeasons.map((season) => {
                const isActive = season.id === currentSeason.id;
                return (
                  <div
                    key={season.id}
                    className={`flex items-center justify-center transition-all ${isActive ? "opacity-100" : "opacity-70"}`}
                    style={{ backgroundColor: season.colors.solid }}
                  >
                    <div className="text-center text-white">
                      <p className="font-serif text-2xl md:text-3xl">{season.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.4em] text-white/85">{season.verb}</p>
                      <p className="mt-1 text-xs text-white/70">
                        {season.scaledRange[0]}-{season.scaledRange[1]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute inset-[14%] rounded-full border border-white/25" />
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <div className="rounded-full border-4 border-white bg-slate-900 shadow-lg">
              <div className="h-4 w-4 rounded-full bg-amber-300" />
            </div>
            <div className="mt-2 -ml-4 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              Age {age}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-3">
          {scaledSeasons.map((season) => {
            const isActive = season.id === currentSeason.id;
            return (
              <div
                key={season.id}
                className={`rounded-3xl border px-4 py-3 transition-all ${
                  isActive ? "border-white/70 bg-white/80 shadow-lg" : "border-white/40 bg-white/55"
                }`}
                style={
                  isActive
                    ? { borderColor: season.colors.solid, boxShadow: `0 0 0 2px ${season.colors.soft}` }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{season.verb}</p>
                    <h3 className="font-serif text-xl" style={{ color: season.colors.ink }}>
                      {season.name}
                    </h3>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{ backgroundColor: season.colors.soft, color: season.colors.ink }}
                  >
                    {season.scaledRange[0]}-{season.scaledRange[1]}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{season.summary}</p>
                {worldview === "sacred" && season.sacredAnchor && isActive && (
                  <p className="mt-2 text-xs italic text-slate-500">
                    "{season.sacredAnchor.excerpt}" — {season.sacredAnchor.citation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
