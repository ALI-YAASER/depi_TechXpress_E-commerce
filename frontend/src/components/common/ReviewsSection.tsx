import { Star } from "lucide-react";

export default function ReviewsSection() {
  const reviews = [
    {
      stars: 5,
      quote: "Received my Dell XPS 15 in under 30 hours in New Cairo. The courier patiently waited while I unboxed the sealed package, tested the OLED screen and ran the diagnostics before paying. Pristine quality and genuine warranty card inside.",
      avatar: "AE",
      name: "Eng. Ahmed El-Sayed",
      role: "Lead Software Architect",
      location: "New Cairo, Egypt",
      product: "Dell XPS 15 9530 OLED"
    },
    {
      stars: 5,
      quote: "Ordering a MacBook Pro M3 online seemed risky until I found TechXpress with their inspection-on-delivery policy. The machine was 100% factory sealed, verified on Apple's coverage site immediately, and serial matched the invoice.",
      avatar: "MK",
      name: "Mariam Khalil",
      role: "Creative Director & 3D Artist",
      location: "Maadi, Cairo",
      product: "Apple MacBook Pro 16\" M3 Max"
    },
    {
      stars: 5,
      quote: "The Odyssey OLED G9 monitor is monumental! Delivery to Alexandria was seamless and handled with extreme care. Customer support on WhatsApp answered all my questions regarding refresh rates and cables within 2 minutes.",
      avatar: "TA",
      name: "Tarek Abdel-Rahman",
      role: "Competitive Gamer & Streamer",
      location: "Smouha, Alexandria",
      product: "Samsung Odyssey OLED G9 49\""
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white" id="reviews" aria-label="Customer Reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Head */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 mb-2">
              Verified Buyer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Trusted by Thousands of <span className="text-indigo-600">Tech Enthusiasts</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
            Real testimonials from developers, designers, and gamers who received and inspected their hardware before paying.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {rev.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {rev.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {rev.role} · {rev.location}
                    </div>
                    <div className="text-[10px] font-semibold text-indigo-600 truncate mt-0.5">
                      Purchased: {rev.product}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
