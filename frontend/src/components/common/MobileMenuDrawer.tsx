import { Link, NavLink } from "react-router-dom";
import { X, Search, Cpu, Laptop, Smartphone, Headphones, Monitor, Gamepad2, Mouse, Scale, Sparkles, MessageSquare } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function MobileMenuDrawer() {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsSearchOpen,
    user,
    isAuthenticated,
    isAdmin,
    logout,
    sendDirectWhatsApp
  } = useShop();

  if (!isMobileMenuOpen) return null;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const categories = [
    { to: "/products?categoryId=1", label: "Laptops & Computers", icon: Laptop },
    { to: "/products?categoryId=2", label: "Smartphones & Tablets", icon: Smartphone },
    { to: "/products?categoryId=3", label: "Audio & Headphones", icon: Headphones },
    { to: "/products?categoryId=4", label: "Monitors & Displays", icon: Monitor },
    { to: "/products?categoryId=5", label: "Gaming & Consoles", icon: Gamepad2 },
    { to: "/products?categoryId=6", label: "Accessories & Peripherals", icon: Mouse }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeMenu}
      />

      {/* Drawer Panel */}
      <aside className="fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm bg-slate-900 text-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-md">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-lg tracking-wider">
              Tech<span className="text-cyan-400">Xpress</span>
            </span>
          </Link>

          <button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm font-bold cursor-pointer"
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Search Trigger */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-400 text-xs transition-colors cursor-pointer"
            onClick={() => {
              closeMenu();
              setIsSearchOpen(true);
            }}
          >
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Search laptops, phones, specs...</span>
          </button>

          {/* User Account / Admin Status */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{user?.fullName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                    </div>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 text-xs font-semibold">
                  <Link to="/profile" onClick={closeMenu} className="text-cyan-400 hover:underline">
                    Profile & Orders
                  </Link>
                  {isAdmin && (
                    <>
                      <span className="text-slate-600">·</span>
                      <Link to="/admin" onClick={closeMenu} className="text-indigo-400 hover:underline">
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                  <span className="text-slate-600">·</span>
                  <button onClick={() => { logout(); closeMenu(); }} className="text-rose-400 hover:underline ml-auto">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Account Access</span>
                <div className="flex items-center gap-2">
                  <Link to="/login" onClick={closeMenu} className="text-cyan-400 hover:underline">
                    Login
                  </Link>
                  <span className="text-slate-600">/</span>
                  <Link to="/register" onClick={closeMenu} className="text-indigo-400 hover:underline">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link
              to="/recommendations"
              onClick={closeMenu}
              className="flex items-center gap-2 p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Find My Device</span>
            </Link>
            <Link
              to="/compare"
              onClick={closeMenu}
              className="flex items-center gap-2 p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900/60 transition-colors"
            >
              <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Compare Specs</span>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Electronics Categories
            </div>
            <ul className="space-y-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.to}>
                    <NavLink
                      to={cat.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span>{cat.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* WhatsApp Specialist Link */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                sendDirectWhatsApp(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Tech Advice (0106 571 2366)</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
