import { useState, useMemo } from "react";
import { estatePlanningElements, categoryLabels, type Category, type EstatePlanningElement } from "@/data/estatePlanningElements";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categoryStyles: Record<Category, string> = {
  charitable: "bg-charitable text-charitable-foreground hover:bg-charitable/90 border-charitable",
  personal: "bg-personal text-personal-foreground hover:bg-personal/90 border-personal",
  qualified: "bg-qualified text-qualified-foreground hover:bg-qualified/90 border-qualified",
};

const categoryBadgeStyles: Record<Category, string> = {
  charitable: "bg-charitable/10 text-charitable border-charitable/30",
  personal: "bg-personal/10 text-personal border-personal/30",
  qualified: "bg-qualified/10 text-qualified border-qualified/30",
};

export default function PeriodicTable() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedElement, setSelectedElement] = useState<EstatePlanningElement | null>(null);

  const filtered = useMemo(() => {
    return estatePlanningElements.filter((el) => {
      const matchesSearch =
        !search ||
        el.name.toLowerCase().includes(search.toLowerCase()) ||
        el.symbol.toLowerCase().includes(search.toLowerCase()) ||
        el.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !activeCategory || el.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<Category, EstatePlanningElement[]> = {
      charitable: [],
      personal: [],
      qualified: [],
    };
    filtered.forEach((el) => groups[el.category].push(el));
    return groups;
  }, [filtered]);

  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
          Periodic Table of Estate Planning Elements™
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click any element to learn more about the strategy, who it's best for, and key benefits.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              className={activeCategory === cat ? categoryStyles[cat] : ""}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat === "charitable" ? "Charitable" : cat === "personal" ? "Personal" : "Qualified"}
            </Button>
          ))}
          {(search || activeCategory) && (
            <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setActiveCategory(null); }}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid by category */}
      {(Object.keys(grouped) as Category[]).map((cat) =>
        grouped[cat].length > 0 ? (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-sm ${categoryStyles[cat].split(" ")[0]}`} />
              {categoryLabels[cat]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              <AnimatePresence mode="popLayout">
                {grouped[cat].map((el) => (
                  <motion.button
                    key={el.symbol}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => setSelectedElement(el)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${categoryStyles[el.category]}`}
                  >
                    <span className="text-2xl font-bold font-serif">{el.symbol}</span>
                    <span className="text-[10px] leading-tight mt-1 opacity-90 text-center">{el.name}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null
      )}

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No strategies found matching your search.
        </p>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedElement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-xl font-bold font-serif ${categoryStyles[selectedElement.category]}`}>
                    {selectedElement.symbol}
                  </span>
                  <div>
                    <DialogTitle className="font-serif">{selectedElement.name}</DialogTitle>
                    <Badge variant="outline" className={categoryBadgeStyles[selectedElement.category]}>
                      {categoryLabels[selectedElement.category]}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="pt-2">{selectedElement.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Best For</h4>
                  <p className="text-sm text-muted-foreground">{selectedElement.bestFor}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Key Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedElement.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-personal mt-0.5">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Considerations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedElement.considerations.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedElement.estimatedSavingsRange && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Estimated Savings Range</h4>
                    <p className="text-sm font-medium text-personal">{selectedElement.estimatedSavingsRange}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
