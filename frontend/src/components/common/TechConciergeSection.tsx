import { MessageSquare, Cpu, CheckCircle2 } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function TechConciergeSection() {
  const { sendDirectWhatsApp } = useShop();

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden" id="tech-concierge">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Cpu className="w-3.5 h-3.5" /> Free Technical Guidance & Spec Matching
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Unsure Which Machine Fits Your Workflow?<br />
              <span className="text-cyan-400">Talk Directly with a Tech Specialist</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Our hardware engineers are available 7 days a week via WhatsApp to analyze your engineering, programming, or gaming workload and recommend the ideal laptop or setup for your budget.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Factory Seal Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>RAM & SSD Upgrade Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Order Confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <button
              type="button"
              onClick={() => sendDirectWhatsApp(null)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Connect on WhatsApp VIP</span>
            </button>
            <span className="text-[11px] text-slate-400 mt-2">
              Instant response within ~2 minutes · 10am – 11pm daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
