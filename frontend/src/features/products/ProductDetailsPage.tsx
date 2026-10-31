import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  ShieldCheck,
  Truck,
  Eye,
  ShoppingBag,
  Scale,
  MessageSquare,
  Star,
  ArrowRight,
  Cpu,
  X
} from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { productService } from "../../services/productService";
import type { ProductDetailDto } from "../../types/product";
import { EGYPT_GOVERNORATES } from "../../types/cart";
import ProductCard from "./ProductCard";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    addToCart,
    openCheckoutWithProduct,
    sendDirectWhatsApp,
    isWishlisted,
    toggleWishlist,
    isComparing,
    toggleCompare,
    selectedGov,
    setSelectedGov
  } = useShop();

  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const numericId = Number(id);
    if (!isNaN(numericId)) {
      productService.getProductById(numericId).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    } else {
      productService.getProductBySlug(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  const images = product?.images && product.images.length > 0
    ? product.images.map((img) => img.imageUrl)
    : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80"];

  useEffect(() => {
    if (activeImgIndex >= images.length) {
      setActiveImgIndex(0);
    }
  }, [images.length, activeImgIndex]);

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox & arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName || "")) return;
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isLightboxOpen]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || images.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  if (loading) {
    return (
      <div className="py-28 text-center space-y-4">
        <Cpu className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
        <h3 className="font-bold text-lg text-slate-800">Loading hardware specifications...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-28 text-center max-w-md mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Device Not Found</h2>
        <p className="text-xs text-slate-500">The product link may have changed or the item has been retired.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-full px-6 py-3 text-sm"
        >
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const discount = product.discountPrice && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isFav = isWishlisted(product.id);
  const isComp = isComparing(product.id);

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .slice(0, 4);

  return (
    <div className="pb-24 bg-slate-50">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Catalog</Link>
          <span>/</span>
          <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-indigo-600 transition-colors">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <section className="pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div
                className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 p-6 flex items-center justify-center shadow-sm select-none touch-pan-y group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  key={activeImgIndex}
                  src={images[activeImgIndex]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105 cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to expand high-resolution view"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Top Action Buttons (Wishlist & Zoom Lightbox) */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-11 h-11 rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 cursor-pointer border border-slate-200 ${
                      isFav ? "text-rose-500" : "text-slate-400 hover:text-slate-700"
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Bookmark Wishlist"
                    title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/90 shadow-md backdrop-blur-sm text-slate-600 hover:text-black transition-all hover:scale-110 cursor-pointer border border-slate-200"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="Expand image"
                    title="Expand full screen"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>

                {/* Gallery Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-black shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-black shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
                      onClick={handleNextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Bottom Counter */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 text-white backdrop-blur-md text-xs font-bold shadow-lg border border-white/10">
                      <span>Image {activeImgIndex + 1} of {images.length}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-none">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 p-1.5 bg-white shrink-0 transition-all duration-200 cursor-pointer overflow-hidden ${
                        activeImgIndex === idx
                          ? "border-indigo-600 ring-2 ring-indigo-200 scale-105 shadow-md"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => setActiveImgIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details & Purchase Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category, Brand, Stock */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {product.categoryName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {product.brandName}
                </span>
                <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1.5 ml-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  In Stock · Ready for Immediate Dispatch
                </span>
              </div>

              {/* Title & SKU */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>SKU: {product.sku}</span>
                  <span>•</span>
                  <span>Brand ID: #{product.brandId}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-slate-900">{product.rating || 4.9} / 5.0</span>
                <span className="text-slate-400">({product.reviewsCount || 42} verified customer reviews)</span>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-slate-900">
                    {product.finalPrice.toLocaleString()} <span className="text-sm font-bold text-slate-500">EGP</span>
                  </span>
                  {Boolean(product.discountPrice && product.price > product.discountPrice) && (
                    <s className="text-sm text-slate-400 line-through">
                      {product.price.toLocaleString()} EGP
                    </s>
                  )}
                </div>
                {discount > 0 && (
                  <div className="text-xs font-bold text-emerald-700">
                    🎉 You save {(product.price - product.finalPrice).toLocaleString()} EGP on today's pricing!
                  </div>
                )}
              </div>

              {/* Reassurance Trust Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 text-xs text-indigo-950">
                <div className="flex items-start gap-2.5">
                  <Eye className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Inspect & Test Before Payment:</strong>
                    <span className="text-[11px] text-slate-600">
                      Open packaging, verify screen and power on device before paying courier.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Official Certified Warranty:</strong>
                    <span className="text-[11px] text-slate-600">
                      2-Year official manufacturer warranty card included in the box.
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden h-12">
                    <button
                      type="button"
                      className="w-11 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base cursor-pointer"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="w-11 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base cursor-pointer"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 rounded-xl text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
                    onClick={() => addToCart(product, quantity)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart ({quantity})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold h-11 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer text-xs"
                    onClick={() => sendDirectWhatsApp(product)}
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>WhatsApp Order</span>
                  </button>

                  <button
                    type="button"
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold h-11 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer"
                    onClick={() => openCheckoutWithProduct(product)}
                  >
                    <span>Instant COD Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(product.id)}
                    className={`w-full flex items-center justify-center gap-1.5 h-11 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      isComp
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isComp ? "In Comparison" : "Compare Specs"}</span>
                  </button>
                </div>
              </div>

              {/* Governorate Shipping Calculator */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>Shipping Calculator to your Governorate:</span>
                  </span>
                  <select
                    className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    value={selectedGov.id}
                    onChange={(e) => {
                      const g = EGYPT_GOVERNORATES.find((gov) => gov.id === e.target.value);
                      if (g) setSelectedGov(g);
                    }}
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id}>{gov.name} ({gov.nameAr})</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Shipping to <strong className="text-slate-800">{selectedGov.name}</strong> takes{" "}
                  <strong className="text-slate-800">{selectedGov.days}</strong> and costs{" "}
                  <strong className="text-emerald-700">{selectedGov.shipping === 0 || product.finalPrice >= 5000 ? "FREE" : `${selectedGov.shipping} EGP`}</strong> (Orders over 5,000 EGP qualify for Free Delivery).
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications Section */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-600" />
              <span>Full Technical Specifications</span>
            </h2>

            {product.specifications && product.specifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                      {spec.name}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
                Official specifications sheet for this SKU is pending system synchronization.
              </div>
            )}

            {/* Full Detailed Description */}
            {product.description && (
              <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <h3 className="font-extrabold text-base text-slate-900">Device Overview & Architecture</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Related Hardware */}
          {relatedProducts.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 mb-2">
                    Similar Equipment
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Related <span className="text-indigo-600">Hardware & Alternatives</span>
                  </h2>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 rounded-full h-10 px-5 text-xs font-bold transition-colors self-start sm:self-auto"
                >
                  <span>Browse All Hardware</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm sm:text-base truncate max-w-md">{product.name}</span>
              {images.length > 1 && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-xs">
                  {activeImgIndex + 1} / {images.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              aria-label="Close lightbox"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={images[activeImgIndex]}
              alt={product.name}
              className="max-h-[75vh] max-w-[90vw] object-contain transition-all duration-300 drop-shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xl z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-2xl z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 pt-4 border-t border-white/10 scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-white/5 transition-all overflow-hidden shrink-0 cursor-pointer ${
                    activeImgIndex === idx
                      ? "border-cyan-400 scale-105 shadow-lg shadow-cyan-400/20"
                      : "border-white/20 opacity-50 hover:opacity-90"
                  }`}
                  aria-label={`Preview image ${idx + 1}`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
