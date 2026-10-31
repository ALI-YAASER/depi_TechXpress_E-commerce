import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Cpu,
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Scale,
  Sparkles,
  LayoutDashboard,
  MessageSquare
} from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const {
    totalCartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsMobileMenuOpen,
    isAuthenticated,
    isAdmin,
    user,
    sendDirectWhatsApp
  } = useShop();

  const [headerSearch, setHeaderSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch("");
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0",
      isActive
        ? "bg-white/15 text-cyan-400 font-bold"
        : "text-slate-300 hover:text-white hover:bg-white/5"
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md text-white shadow-lg transition-all" id="siteHeader">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Top Header Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 h-16 sm:h-20">
          {/* Left Brand & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all shrink-0 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open main menu"
              title="Categories and menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform shrink-0">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span className="flex flex-col">
                <span className="font-extrabold text-base sm:text-xl lg:text-2xl tracking-wider leading-none">
                  TECH<span className="text-cyan-400">XPRESS</span>
                </span>
                <span className="hidden xs:inline text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                  HIGH-PERFORMANCE HARDWARE
                </span>
              </span>
            </Link>
          </div>

          {/* Center Search Input Trigger */}
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden sm:block mx-1 md:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 sm:py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-left truncate cursor-pointer"
                title="Search electronics..."
              >
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Search laptops, RTX GPUs, OLEDs, smartphones...</span>
              </button>
            </form>
          </div>

          {/* Right Action Icons (Compare, Wishlist, Cart, WhatsApp, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Small Mobile Search Icon Button */}
            <button
              type="button"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-cyan-400 transition-colors shrink-0 cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              title="Search electronics"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp VIP Advisor */}
            <button
              type="button"
              onClick={() => sendDirectWhatsApp(null)}
              className="hidden xl:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
              title="Direct WhatsApp Tech Advisor"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp VIP</span>
            </button>

            {/* Compare Button */}
            <Link
              to="/compare"
              className="hidden md:inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white gap-1.5 h-9 px-2.5 shrink-0 transition-colors"
              title="Compare Specifications"
              aria-label={`Compare list (${compareList.length})`}
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline text-xs font-semibold">Compare</span>
              {compareList.length > 0 && (
                <span className="text-[11px] px-1.5 rounded-full bg-indigo-600 text-white font-bold leading-none">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="hidden md:inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white gap-1.5 h-9 px-2.5 shrink-0 transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label={`Wishlist (${wishlist.length})`}
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "text-rose-500 fill-rose-500" : "text-slate-300"}`} />
              <span className="hidden lg:inline text-xs font-semibold">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="text-[11px] px-1.5 rounded-full bg-rose-500 text-white font-bold leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold gap-1.5 h-9 px-3 shadow-md shadow-indigo-600/30 active:scale-95 transition-transform shrink-0 cursor-pointer"
              title="Shopping Cart"
              aria-label={`Shopping Cart (${totalCartCount})`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline text-xs font-bold leading-none">Cart</span>
              <span className="text-[11px] min-w-[18px] h-[18px] px-1 rounded-full bg-black text-cyan-300 font-black flex items-center justify-center leading-none">
                {totalCartCount}
              </span>
            </button>

            {/* User Profile / Admin or Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-indigo-950 border border-indigo-700/80 text-cyan-300 text-xs font-bold hover:bg-indigo-900 transition-colors shrink-0"
                    title="Admin Panel"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition-colors shrink-0"
                  title={user?.fullName || "My Account"}
                  aria-label="Account"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-colors shrink-0"
                title="Account Login"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav
          className="hidden md:flex items-center gap-1 py-2 text-xs font-semibold text-slate-300 border-t border-slate-800/80 overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap scroll-smooth"
          aria-label="Hardware Categories and Fast Filters"
        >
          <div className="flex items-center gap-1 shrink-0">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/products" end className={navClass}>
              All Catalog
            </NavLink>
            <NavLink
              to="/products?sortBy=popularity"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 flex items-center gap-1",
                  isActive || location.search.includes("popularity")
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-amber-400 hover:bg-amber-400/10"
                )
              }
            >
              🔥 Best Sellers
            </NavLink>
            <NavLink to="/products?categoryId=1" className={navClass}>
              Laptops & PCs
            </NavLink>
            <NavLink to="/products?categoryId=2" className={navClass}>
              Smartphones
            </NavLink>
            <NavLink to="/products?categoryId=3" className={navClass}>
              Audio & ANC
            </NavLink>
            <NavLink to="/products?categoryId=4" className={navClass}>
              Monitors & OLED
            </NavLink>
            <NavLink to="/products?categoryId=5" className={navClass}>
              Gaming Gear
            </NavLink>
            <NavLink to="/products?categoryId=6" className={navClass}>
              Accessories
            </NavLink>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-2 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5",
                  isActive ? "bg-cyan-500/20 text-cyan-300" : "text-cyan-400 hover:bg-white/5"
                )
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find My Device</span>
            </NavLink>
            <NavLink to="/compare" className={navClass}>
              Compare
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}