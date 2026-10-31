import { ShieldCheck, Eye, Truck, RefreshCw } from "lucide-react";

export default function GuaranteesSection() {
  const items = [
    {
      num: "01",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: "100% Genuine with Official Warranty",
      desc: "Every device sold at TechXpress is brand new, factory sealed, and backed by 12 to 24 months of authorised manufacturer warranty."
    },
    {
      num: "02",
      icon: <Eye className="w-6 h-6 text-indigo-600" />,
      title: "Inspect & Test Before Payment",
      desc: "Zero-risk shopping: You have full permission to open the shipment, inspect hardware condition, and verify specifications with the courier before paying."
    },
    {
      num: "03",
      icon: <Truck className="w-6 h-6 text-indigo-600" />,
      title: "Express 24 - 48h Nationwide Shipping",
      desc: "Fast, tracked delivery across Greater Cairo, Alexandria, Delta, Canal cities, and Upper Egypt with real-time SMS and WhatsApp tracking."
    },
    {
      num: "04",
      icon: <RefreshCw className="w-6 h-6 text-indigo-600" />,
      title: "14-Day Hassle-Free Replacement",
      desc: "If any manufacturing imperfection is identified or if you prefer an upgrade, exchange your device swiftly within 14 days without red tape."
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200" id="guarantees" aria-label="Store Guarantees">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Head */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200">
            Certified Tech Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Purchase Your Hardware from <span className="text-indigo-600">TechXpress</span>?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We provide a 100% risk-free technology acquisition experience designed for developers, gamers, and tech enthusiasts.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl p-6 bg-white border border-slate-200/90 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl group"
            >
              <span className="absolute top-4 right-4 font-black text-2xl text-slate-200 group-hover:text-indigo-200 transition-colors">
                {item.num}
              </span>

              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
