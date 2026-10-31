import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag
} from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { EGYPT_GOVERNORATES } from "../../types/cart";
import { toast } from "sonner";

export default function CartPage() {
  const {
    cart,
    totalCartCount,
    cartSubtotal,
    isFreeShipping,
    shippingFee,
    cartTotal,
    updateCartQty,
    removeFromCart,
    clearCart,
    selectedGov,
    setSelectedGov
  } = useShop();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "TECH2026" || promoCode.trim().toUpperCase() === "SAVE500") {
      setPromoApplied(true);
      toast.success("Promo code applied: 500 EGP discount granted!");
    } else {
      toast.error("Invalid coupon code. Try 'TECH2026'");
    }
  };

  const discountAmount = promoApplied ? 500 : 0;
  const finalPayable = Math.max(0, cartTotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Looks like you haven't added any electronics to your cart yet. Browse our workstation laptops, flagship smartphones, and monitors.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-7 py-3.5 rounded-full text-sm shadow-md transition-colors"
        >
          <span>Explore Products Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Shopping Cart</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Shopping Cart ({totalCartCount} items)
            </h1>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Entire Cart</span>
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 mb-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            {isFreeShipping ? (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Great news! Your hardware order qualifies for FREE nationwide delivery.</span>
              </span>
            ) : (
              <span>
                Add <b className="text-indigo-600">{(5000 - cartSubtotal).toLocaleString()} EGP</b> more to unlock Free Delivery
              </span>
            )}
            <span className="text-slate-400 font-semibold">Free at 5,000 EGP</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (cartSubtotal / 5000) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor || ''}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-50 p-2 border border-slate-100 shrink-0 flex items-center justify-center">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80"}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono mb-2">
                      SKU: {item.sku || "TECH-SKU"}
                    </div>
                    <div className="text-sm font-black text-indigo-600">
                      {item.price.toLocaleString()} EGP
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden h-9">
                    <button
                      type="button"
                      className="w-9 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                      onClick={() => updateCartQty(item.productId, -1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-extrabold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm cursor-pointer"
                      onClick={() => updateCartQty(item.productId, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-xs text-slate-400">Total:</div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900">
                      {(item.price * item.quantity).toLocaleString()} EGP
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Order Summary Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Governorate Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Delivery Governorate</span>
                </label>
                <select
                  value={selectedGov.id}
                  onChange={(e) => {
                    const g = EGYPT_GOVERNORATES.find((gov) => gov.id === e.target.value);
                    if (g) setSelectedGov(g);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {EGYPT_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.name} ({gov.days})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. TECH2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full h-10 px-3 pl-8 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600 uppercase"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Calculations */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal ({totalCartCount} items):</span>
                  <span className="font-bold text-slate-900">{cartSubtotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee ({selectedGov.name}):</span>
                  <span className="font-bold text-emerald-600">
                    {isFreeShipping ? "FREE (Orders > 5k)" : `${shippingFee.toLocaleString()} EGP`}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount (TECH2026):</span>
                    <span>-500 EGP</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-indigo-600 text-xl">{finalPayable.toLocaleString()} EGP</span>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Inspection on delivery guaranteed: Test the device before paying the courier.
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/products"
                className="block text-center text-xs font-bold text-slate-500 hover:text-indigo-600"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
