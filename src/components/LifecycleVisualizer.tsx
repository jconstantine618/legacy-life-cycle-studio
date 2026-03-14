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
    <div className="rounded-2xl sm:rounded-[2rem] border border-white/50 bg-white/55 p-4 sm:p-5 shadow-[0_24px_60px_rgba(57,47,35,0.12)] backdrop-blur">
      <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">Your life map</p>
          <h2 className="font-serif text-xl sm:text-2xl text-slate-900">Season Wheel</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs sm:text-sm text-slate-600">
          {worldview === "sacred" ? "Sacred" : "Secular"}
        </div>
      </div>

      {/* Wheel — scales to container width */}
      <div className="relative mx-auto aspect-square w-full max-w-[18rem] sm:max-w-[22rem]">
        <div className="absolute inset-0 rounded-full border-[8px] sm:border-[10px] border-white shadow-inner" />
        <div className="absolute inset-3 sm:inset-4 overflow-hidden rounded-full">
          <div className="grid h-full grid-cols-2 grid-rows-2">
            {scaledSeasons.map((season) => {
              const isActive = season.id === currentSeason.id;
              return (
                <div
                  key={season.id}
                  className={`flex items-center justify-center transition-all ${isActive ? "opacity-100" : "opacity-65"}`}
                  style={{ backgroundColor: season.colors.solid }}
                >
                  <div className="text-center text-white px-1">
                    <p className="font-serif text-lg sm:text-xl md:text-2xl">{season.name}</p>
                    <p className="mt-0.5 text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white/85">{season.verb}</p>
                    <p className="mt-0.5 text-[8px] sm:text-[10px] text-white/70">
                      {season.scaledRange[0]}–{season.scaledRange[1]}
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
          <div className="rounded-full border-[3px] sm:border-4 border-white bg-slate-900 shadow-lg">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-amber-300" />
          </div>
          <div className="mt-1.5 -ml-3 sm:-ml-4 whitespace-nowrap rounded-full bg-slate-900 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">
            Age {age}
          </div>
        </div>
      </div>

      {/* Season Badges */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        {scaledSeasons.map((season) => {
          const isActive = season.id === currentSeason.id;
          return (
            <div
              key={season.id}
              className={`rounded-xl sm:rounded-2xl border px-3 py-2.5 sm:px-3 sm:py-3 transition-all ${
                isActive ? "border-white/70 bg-white/80 shadow-lg" : "border-white/40 bg-white/55"
              }`}
              style={
                isActive
                  ? { borderColor: season.colors.solid, boxShadow: `0 0 0 2px ${season.colors.soft}` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-1">
                <div>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-slate-500">{season.verb}</p>
                  <h3 className="font-serif text-base sm:text-lg" style={{ color: season.colors.ink }}>
                    {season.name}
                  </h3>
                </div>
                <div
                  className="rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold"
                  style={{ backgroundColor: season.colors.soft, color: season.colors.ink }}
                >
                  {season.scaledRange[0]}–{season.scaledRange[1]}
                </div>
              </div>
              {isActive && (
                <>
                  <p className="mt-1.5 text-[11px] sm:text-xs leading-4 sm:leading-5 text-slate-600">{season.summary}</p>
                  {worldview === "sacred" && season.sacredAnchor && (
                    <p className="mt-1.5 text-[10px] sm:text-[11px] italic leading-4 text-slate-500">
                      "{season.sacredAnchor.excerpt}" — {season.sacredAnchor.citation}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
