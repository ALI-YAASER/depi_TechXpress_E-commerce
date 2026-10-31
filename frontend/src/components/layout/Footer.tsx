import { Link } from "react-router-dom";
import { Cpu, Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Heart } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function Footer() {
  const { setIsWishlistOpen } = useShop();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-14 pb-24 md:pb-14" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </span>
              <span className="flex flex-col">
                <span className="font-extrabold text-2xl text-white tracking-wider leading-none">
                  TECH<span className="text-cyan-400">XPRESS</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                  HIGH-PERFORMANCE HARDWARE
                </span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400">
              Your premier e-commerce destination for authentic electronics, developer workstations, flagship smartphones, and pro gaming setups. Complete hardware inspection before payment with authorised nationwide warranty.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Official Brand Distributor</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Hardware Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?categoryId=1" className="hover:text-cyan-400 transition-colors">
                  Laptops & Workstations
                </Link>
              </li>
              <li>
                <Link to="/products?categoryId=2" className="hover:text-cyan-400 transition-colors">
                  Flagship Smartphones & Tablets
                </Link>
              </li>
              <li>
                <Link to="/products?categoryId=3" className="hover:text-cyan-400 transition-colors">
                  Studio Audio & ANC Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?categoryId=4" className="hover:text-cyan-400 transition-colors">
                  Curved & 4K OLED Monitors
                </Link>
              </li>
              <li>
                <Link to="/products?categoryId=5" className="hover:text-cyan-400 transition-colors">
                  Gaming Consoles & Gear
                </Link>
              </li>
              <li>
                <Link to="/products?categoryId=6" className="hover:text-cyan-400 transition-colors">
                  Peripherals & GaN Accessories
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsWishlistOpen(true)}
                  className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer text-slate-400"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Saved Hardware Wishlist</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Customer Care & Service
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/recommendations" className="hover:text-cyan-400 transition-colors font-bold text-slate-200">
                  Find My Device Wizard (AI Assistant)
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-400 transition-colors font-bold text-slate-200">
                  Side-by-Side Specs Comparison
                </Link>
              </li>
              <li>
                <a href="#guarantees" className="hover:text-cyan-400 transition-colors">
                  Inspection Before Payment Policy
                </a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-cyan-400 transition-colors">
                  Track My Order & Delivery Status
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/201065712366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp VIP Support</span>
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-400 transition-colors text-slate-500">
                  Store Administration Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Tech District, New Cairo, Cairo Governorate, Egypt</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Sales & Support: 0106 571 2366</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@techxpress.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Daily: 10:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TechXpress Electronics — All Rights Reserved. 100% Genuine Certified Hardware.
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-bold flex-wrap">
            <span>Cash on Delivery</span> · <span>InstaPay</span> · <span>Visa / Mastercard</span> · <span>ValU / Installments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}