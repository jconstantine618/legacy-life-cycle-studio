import { seasons, type MapLayout, type SeasonDefinition, type Worldview } from "@/data/lifecycle";

interface LifecycleVisualizerProps {
  age: number;
  worldview: Worldview;
  layout: MapLayout;
  highlightSeasonId?: SeasonDefinition["id"];
}

function getCurrentSeasonId(age: number): SeasonDefinition["id"] {
  return (
    seasons.find((season) => age >= season.ageRange[0] && age < season.ageRange[1])?.id ??
    seasons[seasons.length - 1].id
  );
}

function polarPosition(age: number) {
  const angle = -90 + (Math.min(100, Math.max(0, age)) / 100) * 360;
  const radians = (angle * Math.PI) / 180;
  const radius = 44;
  const x = 50 + radius * Math.cos(radians);
  const y = 50 + radius * Math.sin(radians);

  return { x, y };
}

function arcPosition(age: number) {
  const boundedAge = Math.min(100, Math.max(0, age));
  const normalized = boundedAge / 100;
  const x = normalized * 100;
  const centered = normalized * 2 - 1;
  const y = 100 - Math.sqrt(Math.max(0, 1 - centered * centered)) * 92;

  return { x, y };
}

function SeasonBadge({
  season,
  isActive,
  emphasis,
}: {
  season: SeasonDefinition;
  isActive: boolean;
  emphasis: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border px-4 py-3 transition-all ${
        emphasis ? "border-white/70 bg-white/80 shadow-lg" : "border-white/40 bg-white/55"
      }`}
      style={
        isActive
          ? {
              borderColor: season.colors.solid,
              boxShadow: `0 0 0 2px ${season.colors.soft}`,
            }
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
          {season.ageRange[0]}-{season.ageRange[1]}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{season.summary}</p>
    </div>
  );
}

export default function LifecycleVisualizer({
  age,
  worldview,
  layout,
  highlightSeasonId,
}: LifecycleVisualizerProps) {
  const currentSeasonId = highlightSeasonId ?? getCurrentSeasonId(age);
  const marker = layout === "circle" ? polarPosition(age) : arcPosition(age);

  return (
    <div className="rounded-[2rem] border border-white/50 bg-white/55 p-5 shadow-[0_24px_60px_rgba(57,47,35,0.12)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Interactive map</p>
          <h2 className="font-serif text-2xl text-slate-900">
            {layout === "circle" ? "Season Wheel" : "Season Arc"}
          </h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
          {worldview === "sacred" ? "Sacred framing" : "Secular framing"}
        </div>
      </div>

      {layout === "circle" ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-inner" />
            <div className="absolute inset-4 overflow-hidden rounded-full">
              <div className="grid h-full grid-cols-2 grid-rows-2">
                {seasons.map((season) => {
                  const isActive = season.id === currentSeasonId;
                  return (
                    <div
                      key={season.id}
                      className={`flex items-center justify-center transition-all ${isActive ? "opacity-100" : "opacity-80"}`}
                      style={{ backgroundColor: season.colors.solid }}
                    >
                      <div className="text-center text-white">
                        <p className="font-serif text-3xl md:text-4xl">{season.name}</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.4em] text-white/85">{season.verb}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="absolute inset-[14%] rounded-full border border-white/25" />
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className="rounded-full border-4 border-white bg-slate-900 shadow-lg">
                <div className="h-4 w-4 rounded-full bg-amber-300" />
              </div>
              <div className="mt-2 -ml-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Age {age}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-3">
            {seasons.map((season) => (
              <SeasonBadge
                key={season.id}
                season={season}
                emphasis={season.id === currentSeasonId}
                isActive={season.id === currentSeasonId}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="relative mx-auto h-[22rem] w-full max-w-[60rem] overflow-hidden rounded-t-[22rem] border border-white/50 bg-[#ede7db]">
            <div className="absolute inset-x-0 bottom-0 top-10 grid grid-cols-4">
              {seasons.map((season) => {
                const isActive = season.id === currentSeasonId;
                return (
                  <div
                    key={season.id}
                    className={`flex items-end justify-center px-3 pb-10 text-center transition-all ${isActive ? "opacity-100" : "opacity-80"}`}
                    style={{ backgroundColor: season.colors.solid }}
                  >
                    <div className="rounded-2xl bg-white/15 px-3 py-4 backdrop-blur-sm">
                      <p className="font-serif text-4xl text-white/95">{season.name}</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.4em] text-white/80">{season.verb}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-x-8 bottom-0 h-px bg-white/70" />
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <div className="rounded-full border-4 border-white bg-slate-900 shadow-lg">
                <div className="h-4 w-4 rounded-full bg-amber-300" />
              </div>
              <div className="mt-2 -ml-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Age {age}
              </div>
            </div>
            <div className="absolute left-0 right-0 top-5 flex justify-between px-5 text-sm font-semibold text-slate-500">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {seasons.map((season) => (
              <SeasonBadge
                key={season.id}
                season={season}
                emphasis={season.id === currentSeasonId}
                isActive={season.id === currentSeasonId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
