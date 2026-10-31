import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  X,
  ShoppingBag,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function ComparePage() {
  const {
    products,
    compareList,
    toggleCompare,
    addToCart,
    setIsCartOpen,
    openCheckoutWithProduct,
    sendDirectWhatsApp
  } = useShop();

  const [highlightDiffs, setHighlightDiffs] = useState(false);

  // Get compared products
  const comparedProducts = useMemo(() => {
    return products.filter((p) => compareList.includes(p.id));
  }, [products, compareList]);

  // Quick preset matchup loader
  const loadMatchup = (ids: number[]) => {
    // Clear existing
    compareList.forEach((id) => toggleCompare(id));
    // Add new
    ids.forEach((id) => toggleCompare(id));
  };

  // Collect all unique specification names across all compared devices
  const allSpecNames = useMemo(() => {
    const set = new Set<string>();
    // Default standard specs to show first
    const prioritySpecs = ["Processor", "RAM", "Storage", "Display", "Graphics", "Battery", "Weight", "Operating System", "Warranty"];
    prioritySpecs.forEach((s) => set.add(s));

    comparedProducts.forEach((p) => {
      // If product has specifications array (e.g. from mock or details)
      if ("specifications" in p && Array.isArray((p as any).specifications)) {
        (p as any).specifications.forEach((spec: { name: string; value: string }) => {
          set.add(spec.name);
        });
      }
    });

    return Array.from(set);
  }, [comparedProducts]);

  // Helper to extract a spec value by key for a product
  const getProductSpec = (product: any, specKey: string): string => {
    if (product.specifications && Array.isArray(product.specifications)) {
      const match = product.specifications.find(
        (s: { name: string; value: string }) =>
          s.name.toLowerCase() === specKey.toLowerCase()
      );
      if (match) return match.value;
    }

    // Fallbacks based on category/name if not directly in spec list
    const lowerName = product.name.toLowerCase();
    if (specKey.toLowerCase().includes("processor") || specKey.toLowerCase().includes("cpu")) {
      if (lowerName.includes("m3 max")) return "Apple M3 Max (16-core CPU, 40-core GPU)";
      if (lowerName.includes("xps")) return "Intel Core i9-13900H (14 cores, up to 5.4 GHz)";
      if (lowerName.includes("zephyrus")) return "Intel Core Ultra 9 185H (16 cores)";
      if (lowerName.includes("s24")) return "Snapdragon 8 Gen 3 for Galaxy";
      if (lowerName.includes("iphone")) return "Apple A18 Pro (6-core CPU, 6-core GPU)";
      if (lowerName.includes("sony")) return "Sony V1 + QN1 HD Noise Cancelling Processor";
      return "High-performance Multi-core SoC";
    }

    if (specKey.toLowerCase().includes("ram") || specKey.toLowerCase().includes("memory")) {
      if (lowerName.includes("m3 max")) return "64 GB Unified Memory";
      if (lowerName.includes("xps") || lowerName.includes("zephyrus")) return "32 GB LPDDR5X";
      if (lowerName.includes("s24")) return "12 GB LPDDR5X";
      if (lowerName.includes("iphone")) return "8 GB LPDDR5X";
      return "Standard High-Speed Architecture";
    }

    if (specKey.toLowerCase().includes("storage") || specKey.toLowerCase().includes("ssd")) {
      if (lowerName.includes("m3 max") || lowerName.includes("zephyrus")) return "1 TB PCIe 4.0 NVMe SSD";
      if (lowerName.includes("xps")) return "1 TB PCIe 4.0 NVMe SSD";
      if (lowerName.includes("s24") || lowerName.includes("iphone")) return "512 GB UFS 4.0 / NVMe";
      return "512 GB High-Speed Flash";
    }

    if (specKey.toLowerCase().includes("display") || specKey.toLowerCase().includes("screen")) {
      if (lowerName.includes("m3 max")) return '16.2" Liquid Retina XDR (3456x2234, 120Hz ProMotion, 1600 nits)';
      if (lowerName.includes("xps")) return '15.6" 3.5K OLED Touch (3456x2160, 400 nits, 100% DCI-P3)';
      if (lowerName.includes("zephyrus")) return '16.0" 2.5K OLED ROG Nebula (240Hz, 0.2ms, G-SYNC)';
      if (lowerName.includes("odyssey")) return '49" Dual QHD Curved OLED (5120x1440, 240Hz, 0.03ms)';
      if (lowerName.includes("s24")) return '6.8" Dynamic AMOLED 2X (120Hz LTPO, 2600 nits, Gorilla Armor)';
      if (lowerName.includes("iphone")) return '6.9" Super Retina XDR OLED (120Hz ProMotion, Ceramic Shield 2)';
      return "Premium Calibration Panel";
    }

    if (specKey.toLowerCase().includes("graphics") || specKey.toLowerCase().includes("gpu")) {
      if (lowerName.includes("m3 max")) return "40-core Apple Silicon Integrated GPU";
      if (lowerName.includes("xps")) return "NVIDIA GeForce RTX 4070 8GB GDDR6";
      if (lowerName.includes("zephyrus")) return "NVIDIA GeForce RTX 4080 12GB GDDR6";
      return "Dedicated / High-Performance Neural Graphics";
    }

    if (specKey.toLowerCase().includes("battery")) {
      if (lowerName.includes("m3 max")) return "100Wh Li-poly (Up to 22 Hours battery life)";
      if (lowerName.includes("xps")) return "86Wh with 130W USB-C Fast Charging";
      if (lowerName.includes("s24")) return "5000 mAh with 45W Fast Charging";
      if (lowerName.includes("iphone")) return "4685 mAh with MagSafe Fast Wireless";
      if (lowerName.includes("sony")) return "30 Hours with ANC On (3 min charge = 3 hrs playback)";
      return "All-Day Intelligent Power";
    }

    if (specKey.toLowerCase().includes("warranty")) {
      return "2-Year Official Egypt Agent Warranty + TechXpress 14-Day Replacement";
    }

    return "—";
  };

  // Determine if all compared products have different values for this spec
  const isRowDifferent = (specKey: string): boolean => {
    if (comparedProducts.length < 2) return false;
    const firstVal = getProductSpec(comparedProducts[0], specKey);
    return comparedProducts.some((p) => getProductSpec(p, specKey) !== firstVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Device Comparison</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Spec Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Compare Technical Specifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compare CPU, RAM, display technology, graphics, battery, and pricing across up to 4 devices.
            </p>
          </div>

          {comparedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHighlightDiffs(!highlightDiffs)}
                className={`inline-flex items-center gap-2 px-4 h-11 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  highlightDiffs
                    ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{highlightDiffs ? "Highlighting Differences" : "Highlight Differences"}</span>
              </button>

              <button
                type="button"
                onClick={() => compareList.forEach((id) => toggleCompare(id))}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {comparedProducts.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Scale className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              No Devices Selected for Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Select up to 4 devices to compare silicon architectures, benchmarks, display panels, and official warranty terms side by side.
            </p>

            {/* Popular Curated Matchups */}
            <div className="mt-12 max-w-2xl mx-auto">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                Or Load a Popular Head-to-Head Matchup:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => loadMatchup([1, 2])}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-indigo-600 mb-1">Creator Flagships</div>
                  <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600">
                    Dell XPS 15 OLED vs MacBook Pro M3 Max
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Windows RTX Studio vs Apple Silicon M3</div>
                </button>

                <button
                  type="button"
                  onClick={() => loadMatchup([3, 4])}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-indigo-600 mb-1">Mobile Titans</div>
                  <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600">
                    Galaxy S24 Ultra vs iPhone 16 Pro Max
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Snapdragon 8 Gen 3 vs Apple A18 Pro</div>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Browse Products Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Comparison Table */
          <div className="py-8">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-4 sm:p-6 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider align-top">
                      Hardware Overview
                    </th>
                    {comparedProducts.map((p) => {
                      const img =
                        p.primaryImageUrl ||
                        p.images?.find((i) => i.isPrimary)?.imageUrl ||
                        p.images?.[0]?.imageUrl ||
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";

                      return (
                        <th
                          key={p.id}
                          className="p-4 sm:p-6 align-top w-72 min-w-[240px] border-l border-slate-100"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {p.brandName}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleCompare(p.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Remove from comparison"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <Link
                              to={`/products/${p.id}`}
                              className="group block mb-3"
                            >
                              <div className="w-full h-36 rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-2 overflow-hidden">
                                <img
                                  src={img}
                                  alt={p.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 text-sm line-clamp-2 transition-colors">
                                {p.name}
                              </h3>
                            </Link>

                            <div className="mt-auto pt-3">
                              <div className="text-base font-black text-slate-900 mb-3">
                                {p.finalPrice.toLocaleString()} EGP
                              </div>

                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    addToCart(p, 1);
                                    setIsCartOpen(true);
                                  }}
                                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add to Cart</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openCheckoutWithProduct(p)}
                                  className="flex items-center justify-center h-9 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                                >
                                  <span>Buy Now (COD)</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </th>
                      );
                    })}

                    {/* Slot to add another product if < 4 */}
                    {comparedProducts.length < 4 && (
                      <th className="p-6 align-middle text-center border-l border-slate-100 w-64 bg-slate-50/40">
                        <Link
                          to="/products"
                          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-slate-500 hover:text-indigo-600 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:bg-indigo-50">
                            <Plus className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold">Add Another Device</span>
                          <span className="text-[10px] text-slate-400 mt-1">Up to {4 - comparedProducts.length} more</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* Stock status row */}
                  <tr className="bg-white">
                    <td className="p-4 sm:p-5 text-xs font-bold text-slate-700 bg-slate-50/50">
                      Availability
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 sm:p-5 text-xs border-l border-slate-100">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>In Stock ({p.stockQuantity} units)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-500 font-bold">
                            <AlertCircle className="w-4 h-4" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </td>
                    ))}
                    {comparedProducts.length < 4 && <td className="border-l border-slate-100 bg-slate-50/30" />}
                  </tr>

                  {/* Pricing row */}
                  <tr className="bg-white">
                    <td className="p-4 sm:p-5 text-xs font-bold text-slate-700 bg-slate-50/50">
                      Official Price (EGP)
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 sm:p-5 text-xs border-l border-slate-100 font-extrabold text-slate-900">
                        <div>{p.finalPrice.toLocaleString()} EGP</div>
                        {p.discountPrice && (
                          <div className="text-[11px] text-rose-600 font-semibold">
                            Save {(p.price - p.discountPrice).toLocaleString()} EGP
                          </div>
                        )}
                      </td>
                    ))}
                    {comparedProducts.length < 4 && <td className="border-l border-slate-100 bg-slate-50/30" />}
                  </tr>

                  {/* Technical Specifications Rows */}
                  {allSpecNames.map((specKey) => {
                    const isDiff = highlightDiffs && isRowDifferent(specKey);
                    return (
                      <tr
                        key={specKey}
                        className={`transition-colors ${
                          isDiff ? "bg-amber-50/60" : "bg-white hover:bg-slate-50/40"
                        }`}
                      >
                        <td className="p-4 sm:p-5 text-xs font-bold text-slate-700 bg-slate-50/50 flex items-center justify-between">
                          <span>{specKey}</span>
                          {isDiff && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              Diff
                            </span>
                          )}
                        </td>
                        {comparedProducts.map((p) => (
                          <td
                            key={p.id}
                            className={`p-4 sm:p-5 text-xs leading-relaxed border-l border-slate-100 ${
                              isDiff ? "font-semibold text-slate-900" : "text-slate-600"
                            }`}
                          >
                            {getProductSpec(p, specKey)}
                          </td>
                        ))}
                        {comparedProducts.length < 4 && (
                          <td className="border-l border-slate-100 bg-slate-50/30" />
                        )}
                      </tr>
                    );
                  })}

                  {/* VIP Inquiry row */}
                  <tr className="bg-white">
                    <td className="p-4 sm:p-5 text-xs font-bold text-slate-700 bg-slate-50/50">
                      Direct Tech Consultation
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 sm:p-5 text-xs border-l border-slate-100">
                        <button
                          type="button"
                          onClick={() => sendDirectWhatsApp(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Ask Hardware Engineer</span>
                        </button>
                      </td>
                    ))}
                    {comparedProducts.length < 4 && <td className="border-l border-slate-100 bg-slate-50/30" />}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Guarantee Banner */}
            <div className="mt-8 p-6 rounded-2xl bg-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    100% Genuine Hardware Assured Across Egypt
                  </h4>
                  <p className="text-xs text-slate-300">
                    All benchmarked devices ship in sealed factory packaging with official manufacturer serial numbers and local agent warranty.
                  </p>
                </div>
              </div>
              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold transition-colors shrink-0"
              >
                <span>Try "Find My Device" AI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
