import { pdfAssets, worldviewLabels, layoutLabels, type MapLayout, type Worldview } from "@/data/lifecycle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Download } from "lucide-react";

interface PdfLibraryProps {
  worldview: Worldview;
  layout: MapLayout;
}

export default function PdfLibrary({ worldview, layout }: PdfLibraryProps) {
  const filteredAssets = pdfAssets.filter((asset) => asset.worldview === worldview && asset.layout === layout);
  const selectedAsset = filteredAssets[0] ?? pdfAssets[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Canonical assets</p>
          <h2 className="mt-2 font-serif text-3xl text-slate-900">Source PDF library</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The app keeps local copies of the original Legacy Life Cycle charts so people can move between the static
            reference materials and the interactive product without leaving context.
          </p>
        </div>

        {pdfAssets.map((asset) => {
          const isActive = asset.id === selectedAsset.id;
          return (
            <Card
              key={asset.id}
              className={`overflow-hidden border-white/50 bg-white/70 shadow-sm transition-all ${
                isActive ? "ring-2 ring-slate-900/10" : ""
              }`}
            >
              <CardContent className="p-0">
                <img
                  src={asset.previewUrl}
                  alt={asset.title}
                  className="aspect-[4/3] w-full border-b border-slate-200 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{asset.title}</h3>
                      <p className="text-sm text-slate-500">
                        {worldviewLabels[asset.worldview]} · {layoutLabels[asset.layout]}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{asset.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm" className="rounded-full">
                      <a href={asset.pdfUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open PDF
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="rounded-full bg-white">
                      <a href={asset.pdfUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(62,54,43,0.12)]">
        <CardContent className="p-0">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Selected preview</p>
            <h3 className="mt-2 font-serif text-2xl text-slate-900">{selectedAsset.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{selectedAsset.description}</p>
          </div>
          <div className="aspect-[4/3] bg-[#f4eee4]">
            <iframe
              title={selectedAsset.title}
              src={selectedAsset.pdfUrl}
              className="h-full w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
