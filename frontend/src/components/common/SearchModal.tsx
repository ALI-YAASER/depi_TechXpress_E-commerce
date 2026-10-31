import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useShop } from "../../context/ShopContext";

const POPULAR_TAGS = [
  "OLED Laptop",
  "RTX 4070",
  "MacBook Pro M3",
  "iPhone 16 Pro",
  "Galaxy S24 Ultra",
  "240Hz Monitor",
  "Noise Cancelling",
  "MX Master 3S"
];

export default function SearchModal() {
  const { products, isSearchOpen, setIsSearchOpen, openQuickViewById } = useShop();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isSearchOpen) return null;

  const handleFullSearch = (searchTerm: string) => {
    setIsSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl mt-6 sm:mt-12 animate-in slide-in-from-top-4 duration-300">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="search"
            placeholder="Search laptops, smartphones, processors, monitors..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleFullSearch(query);
              }
            }}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="py-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Popular:</span>
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
              }}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-medium transition-colors border border-slate-700/60 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto">
          {query.trim() && filtered.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400 text-sm">
              No electronic products found matching "{query}"
            </div>
          ) : (
            filtered.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-all cursor-pointer group"
                onClick={() => {
                  openQuickViewById(p.id);
                  setIsSearchOpen(false);
                }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={p.primaryImageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80"}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-extrabold text-indigo-400">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {p.brandName}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link */}
        {query.trim() && (
          <div className="pt-4 mt-3 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => handleFullSearch(query)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <span>View all matching results in Products Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
