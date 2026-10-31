import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ShoppingBag, Check, Eye, Truck, Scale } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export default function QuickViewModal() {
  const {
    quickProduct,
    setQuickProduct,
    addToCart,
    openCheckoutWithProduct,
    toggleCompare,
    isComparing
  } = useShop();

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [quickProduct]);

  if (!quickProduct) return null;

  const images = quickProduct.images && quickProduct.images.length > 0
    ? quickProduct.images.map(i => i.imageUrl)
    : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"];

  const discount = quickProduct.discountPrice && quickProduct.price > quickProduct.discountPrice
    ? Math.round(((quickProduct.price - quickProduct.discountPrice) / quickProduct.price) * 100)
    : 0;

  const handleNext = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setQuickProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="font-extrabold text-base sm:text-lg text-slate-900">
            Quick Specifications & Preview
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors text-sm font-bold cursor-pointer"
            type="button"
            onClick={() => setQuickProduct(null)}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Media Column */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 p-4 flex items-center justify-center border border-slate-200 overflow-hidden select-none group">
              <img
                key={activeImgIndex}
                src={images[activeImgIndex]}
                alt={quickProduct.name}
                className="w-full h-full object-contain transition-all duration-300"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm">
                    {activeImgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-14 h-14 rounded-xl border-2 p-1 bg-white shrink-0 transition-all cursor-pointer overflow-hidden ${
                      activeImgIndex === i
                        ? "border-indigo-600 ring-2 ring-indigo-200 shadow-sm"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {quickProduct.categoryName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {quickProduct.brandName}
              </span>
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                  {discount}% OFF
                </span>
              )}
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1 leading-snug">
              {quickProduct.name}
            </h3>

            <div className="text-xs text-slate-400 mb-3">
              SKU: <span className="font-mono">{quickProduct.sku}</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-indigo-600">
                {quickProduct.finalPrice.toLocaleString()} EGP
              </span>
              {Boolean(quickProduct.discountPrice && quickProduct.price > quickProduct.discountPrice) && (
                <s className="text-xs text-slate-400 line-through">
                  {quickProduct.price.toLocaleString()} EGP
                </s>
              )}
            </div>

            {/* Highlights */}
            <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2-Year Certified Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Test & verify hardware with courier before payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fast 24-48h Delivery to all Egyptian Governorates</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-11 rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                  onClick={() => addToCart(quickProduct, 1)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center bg-slate-900 hover:bg-black text-white font-bold h-11 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                  onClick={() => {
                    setQuickProduct(null);
                    openCheckoutWithProduct(quickProduct);
                  }}
                >
                  <span>Buy Now (COD)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleCompare(quickProduct.id)}
                  className={`flex items-center justify-center gap-1.5 h-9 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    isComparing(quickProduct.id)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isComparing(quickProduct.id) ? "In Comparison" : "Compare Specs"}</span>
                </button>

                <Link
                  to={`/products/${quickProduct.id}`}
                  onClick={() => setQuickProduct(null)}
                  className="flex items-center justify-center h-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                >
                  Full Technical Specs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
