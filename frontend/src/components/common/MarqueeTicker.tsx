import { useState } from "react";

interface TickerItem {
  icon: string;
  text: string;
}

const DEFAULT_TECH_TICKER: TickerItem[] = [
  { icon: "🛡️", text: "2-Year Official Manufacturer Warranty on all Certified Devices" },
  { icon: "🔍", text: "Free Inspection & Testing with Courier Before Paying Any Money" },
  { icon: "🚚", text: "Express 24 - 48h Delivery to All Egyptian Governorates" },
  { icon: "⚡", text: "100% Original Brand Hardware: Apple, Dell, Samsung, ASUS & Sony" },
  { icon: "💳", text: "Pay on Delivery (Cash or InstaPay) with 0% Interest Installments" },
  { icon: "🔄", text: "14-Day Hassle-Free Return & Instant Replacement Guarantee" },
  { icon: "📦", text: "Factory-Sealed Original Packaging with Verified Serial Numbers" },
  { icon: "💬", text: "Instant WhatsApp VIP Tech Consultation & Device Matching" }
];

export default function MarqueeTicker({ items = DEFAULT_TECH_TICKER }: { items?: TickerItem[] }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="relative w-full bg-indigo-600 text-white py-2.5 sm:py-3 overflow-hidden select-none border-y border-indigo-700 shadow-sm group cursor-pointer"
      aria-label="Tech store highlights and guarantees"
      role="region"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
      title="Hover or touch to pause ticker"
    >
      <div className="w-full overflow-hidden" dir="ltr">
        <div
          className="animate-marquee flex items-center group-hover:[animation-play-state:paused] active:[animation-play-state:paused]"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {/* Group 1 */}
          <div className="flex shrink-0 items-center gap-8 px-4 font-bold text-xs sm:text-sm tracking-wide">
            {items.map((item, idx) => (
              <span key={`ticker-1-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                <span className="text-base sm:text-lg leading-none">{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-white/40 font-black mr-4 text-xs select-none">•</span>
              </span>
            ))}
          </div>

          {/* Group 2 (Clone for infinite seamless wrap) */}
          <div className="flex shrink-0 items-center gap-8 px-4 font-bold text-xs sm:text-sm tracking-wide" aria-hidden="true">
            {items.map((item, idx) => (
              <span key={`ticker-2-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                <span className="text-base sm:text-lg leading-none">{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-white/40 font-black mr-4 text-xs select-none">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
