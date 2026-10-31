import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "../common/MobileBottomNav";
import MobileMenuDrawer from "../common/MobileMenuDrawer";
import CartDrawer from "../common/CartDrawer";
import WishlistDrawer from "../common/WishlistDrawer";
import QuickViewModal from "../common/QuickViewModal";
import SearchModal from "../common/SearchModal";
import CheckoutModal from "../common/CheckoutModal";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <MobileMenuDrawer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <SearchModal />
      <CheckoutModal />

      <ScrollRestoration />
    </div>
  );
}