import { NavLink } from "react-router-dom";
import { Home, Grid, Scale, Heart, ShoppingBag } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function MobileBottomNav() {
  const {
    totalCartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsWishlistOpen
  } = useShop();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] shadow-2xl flex items-center justify-around text-slate-400"
      aria-label="Mobile navigation bar"
    >
      {/* Home */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 p-1 text-[10px] font-bold transition-colors ${
            isActive ? "text-indigo-400" : "hover:text-white"
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      {/* Shop */}
      <NavLink
        to="/products"
        className={({ isActive }) =>
          `min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 p-1 text-[10px] font-bold transition-colors ${
            isActive ? "text-indigo-400" : "hover:text-white"
          }`
        }
      >
        <Grid className="w-5 h-5" />
        <span>Catalog</span>
      </NavLink>

      {/* Compare */}
      <NavLink
        to="/compare"
        className={({ isActive }) =>
          `min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 p-1 text-[10px] font-bold transition-colors relative ${
            isActive ? "text-indigo-400" : "hover:text-white"
          }`
        }
      >
        <div className="relative">
          <Scale className="w-5 h-5" />
          {compareList.length > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-indigo-500 text-white font-extrabold text-[9px] flex items-center justify-center">
              {compareList.length}
            </span>
          )}
        </div>
        <span>Compare</span>
      </NavLink>

      {/* Wishlist */}
      <button
        type="button"
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 p-1 text-[10px] font-bold hover:text-white transition-colors relative cursor-pointer"
        onClick={() => setIsWishlistOpen(true)}
      >
        <div className="relative">
          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Saved</span>
      </button>

      {/* Cart */}
      <button
        type="button"
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1 p-1 text-[10px] font-bold hover:text-white transition-colors relative cursor-pointer"
        onClick={() => setIsCartOpen(true)}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-indigo-400" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white font-black text-[9px] flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}
