import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Cpu,
  Laptop,
  Smartphone,
  Monitor,
  Gamepad2,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
  Scale,
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import { useShop } from "../../context/ShopContext";

interface QuestionOption {
  id: string;
  label: string;
  description: string;
  icon?: any;
}

const WORKLOADS: QuestionOption[] = [
  {
    id: "engineering",
    label: "Software Engineering & DevOps",
    description: "Docker, local LLMs, multi-container orchestration, compile speed",
    icon: Cpu
  },
  {
    id: "creative",
    label: "4K/8K Video Editing & 3D Rendering",
    description: "DaVinci Resolve, Premiere Pro, Blender, color-accurate OLED",
    icon: Monitor
  },
  {
    id: "gaming",
    label: "AAA Gaming & Esports",
    description: "High refresh rates, ray tracing, DLSS 3.5, low input latency",
    icon: Gamepad2
  },
  {
    id: "productivity",
    label: "Executive & University Productivity",
    description: "All-day 18+ hr battery, lightweight chassis, Zoom, Office 365",
    icon: Laptop
  }
];

const FORM_FACTORS: QuestionOption[] = [
  {
    id: "all",
    label: "Show Best Hardware Across All Categories",
    description: "Let the engine suggest matching laptops, phones, and displays"
  },
  {
    id: "laptops",
    label: "Laptops & Mobile Workstations",
    description: "MacBook Pro, Dell XPS, ASUS ROG Zephyrus",
    icon: Laptop
  },
  {
    id: "smartphones",
    label: "Flagship Smartphones",
    description: "iPhone Pro Max, Galaxy Ultra with high-end cameras & silicon",
    icon: Smartphone
  },
  {
    id: "displays",
    label: "Ultrawide & High-Refresh Monitors",
    description: "OLED gaming monitors, studio color grading displays",
    icon: Monitor
  }
];

const BUDGET_RANGES: QuestionOption[] = [
  {
    id: "any",
    label: "No Budget Limit — Best in Class Performance",
    description: "Top-tier flagships and studio workstations"
  },
  {
    id: "under50k",
    label: "Up to 50,000 EGP",
    description: "Sweet spot for performance and value in Egypt"
  },
  {
    id: "50k-90k",
    label: "50,000 — 90,000 EGP",
    description: "High-end creator laptops and premium mobile flagships"
  },
  {
    id: "over90k",
    label: "90,000+ EGP Flagships",
    description: "Extreme silicon: M3 Max, RTX 4080/4090, 49\" OLED"
  }
];

export default function RecommendationsPage() {
  const {
    products,
    addToCart,
    setIsCartOpen,
    openCheckoutWithProduct,
    toggleCompare,
    isComparing,
    sendDirectWhatsApp
  } = useShop();

  const [step, setStep] = useState<number>(1);
  const [selectedWorkload, setSelectedWorkload] = useState<string>("engineering");
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("any");

  // Recommendation engine scoring
  const recommendations = useMemo(() => {
    return products
      .map((p) => {
        let score = 70;
        const reasons: string[] = [];

        // Workload matching
        if (selectedWorkload === "engineering") {
          if (p.name.includes("MacBook") || p.name.includes("XPS")) {
            score += 25;
            reasons.push("Optimized for compile times, virtualization, and Unix workflow");
          }
          if (p.name.includes("Zephyrus")) {
            score += 20;
            reasons.push("High multi-core thermal headroom for large builds");
          }
        } else if (selectedWorkload === "creative") {
          if (p.name.includes("OLED") || p.name.includes("MacBook")) {
            score += 25;
            reasons.push("100% DCI-P3 color calibration for studio editing");
          }
          if (p.name.includes("RTX 4070") || p.name.includes("RTX 4080")) {
            score += 20;
            reasons.push("Dedicated NVENC hardware encoder & CUDA acceleration");
          }
        } else if (selectedWorkload === "gaming") {
          if (p.name.includes("ROG") || p.name.includes("Zephyrus") || p.name.includes("Odyssey")) {
            score += 30;
            reasons.push("240Hz refresh rate panel with ultra-low 0.03ms response time");
          }
        } else if (selectedWorkload === "productivity") {
          if (p.name.includes("MacBook") || p.name.includes("iPhone") || p.name.includes("Galaxy") || p.name.includes("Master 3S")) {
            score += 25;
            reasons.push("Exceptional battery efficiency and ergonomic all-day comfort");
          }
        }

        // Form factor filter
        if (selectedFormFactor === "laptops" && p.categoryId !== 1) score -= 50;
        if (selectedFormFactor === "smartphones" && p.categoryId !== 2) score -= 50;
        if (selectedFormFactor === "displays" && p.categoryId !== 5) score -= 50;

        // Budget filter
        const price = p.finalPrice;
        if (selectedBudget === "under50k" && price > 50000) score -= 40;
        if (selectedBudget === "50k-90k" && (price < 50000 || price > 90000)) score -= 30;
        if (selectedBudget === "over90k" && price < 90000) score -= 30;

        if (reasons.length === 0) {
          reasons.push("Selected as a versatile daily driver for versatile computing");
        }

        return {
          product: p,
          score: Math.min(99, Math.max(65, score)),
          reasons
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [products, selectedWorkload, selectedFormFactor, selectedBudget]);

  const resetWizard = () => {
    setSelectedWorkload("engineering");
    setSelectedFormFactor("all");
    setSelectedBudget("any");
    setStep(1);
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
          <span className="text-slate-900 font-semibold">Tech Matchmaker</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Hardware Recommendation Assistant
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Find the Exact Setup Built for Your Workload
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Answer 3 quick questions about your workflow, preferred form factor, and budget. Our engine matches you with benchmarked hardware available with official Egyptian warranties.
            </p>
          </div>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              step === 1
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${step === 1 ? "text-indigo-200" : "text-slate-400"}`}>
              Step 01
            </div>
            <div className="text-xs sm:text-sm font-black truncate">Primary Workload</div>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              step === 2
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${step === 2 ? "text-indigo-200" : "text-slate-400"}`}>
              Step 02
            </div>
            <div className="text-xs sm:text-sm font-black truncate">Form Factor</div>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              step === 3
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${step === 3 ? "text-indigo-200" : "text-slate-400"}`}>
              Step 03
            </div>
            <div className="text-xs sm:text-sm font-black truncate">Budget in EGP</div>
          </button>
        </div>

        {/* Step 1: Workload */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              What is your primary daily workload?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Choose the task that demands the most compute from your setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKLOADS.map((w) => {
                const Icon = w.icon || Cpu;
                const isSelected = selectedWorkload === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setSelectedWorkload(w.id);
                      setStep(2);
                    }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between">
                        <span>{w.label}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {w.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Form Factor */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              What device category are you looking for?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Select a specific hardware type or let us recommend the full setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORM_FACTORS.map((f) => {
                const Icon = f.icon || Sparkles;
                const isSelected = selectedFormFactor === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormFactor(f.id);
                      setStep(3);
                    }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between">
                        <span>{f.label}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              What is your target investment range?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              All prices include official local VAT and manufacturer warranty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUDGET_RANGES.map((b) => {
                const isSelected = selectedBudget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between">
                        <span>{b.label}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Matched Hardware Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Recommended Hardware Matchups ({recommendations.length})</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ranked by silicon compatibility with your answers.
            </p>
          </div>

          <button
            type="button"
            onClick={resetWizard}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic</span>
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(({ product, score, reasons }) => {
            const img =
              product.primaryImageUrl ||
              product.images?.find((i) => i.isPrimary)?.imageUrl ||
              product.images?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";

            return (
              <div
                key={product.id}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-400"
              >
                {/* Score badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    <Sparkles className="w-3 h-3" />
                    <span>{score}% Compatibility Score</span>
                  </span>

                  <span className="text-xs font-bold text-slate-500">
                    {product.brandName}
                  </span>
                </div>

                {/* Image & Title */}
                <Link
                  to={`/products/${product.id}`}
                  className="group block mb-4"
                >
                  <div className="w-full aspect-video rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-3 overflow-hidden">
                    <img
                      src={img}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 text-sm line-clamp-2 transition-colors">
                    {product.name}
                  </h4>
                </Link>

                {/* Match Reasoning Box */}
                <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Why This Fits You:</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-600">
                    {reasons.map((r, i) => (
                      <li key={i} className="line-clamp-2">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        {product.finalPrice.toLocaleString()} EGP
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          {product.price.toLocaleString()} EGP
                        </div>
                      )}
                    </div>
                    {product.inStock ? (
                      <span className="text-xs font-bold text-emerald-600">
                        In Stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-500">
                        Pre-Order
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openCheckoutWithProduct(product)}
                      className="flex items-center justify-center h-10 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Buy Now (COD)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id)}
                      className={`flex items-center justify-center gap-1.5 h-9 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        isComparing(product.id)
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isComparing(product.id) ? "In Matrix" : "Compare"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sendDirectWhatsApp(product)}
                      className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask Engineer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                Need Custom Corporate B2B Quotation or Multi-Unit Discount?
              </h4>
              <p className="text-xs text-slate-500">
                Contact our Cairo enterprise hardware procurement team directly on WhatsApp for formal tax invoices and bulk tier pricing.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/201000000000?text=Hello%20TechXpress,%20I%20need%20a%20corporate%20hardware%20quotation."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with B2B Sales</span>
          </a>
        </div>
      </div>
    </div>
  );
}
