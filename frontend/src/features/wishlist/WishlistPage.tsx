import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageSquare,
  Sparkles,
  Cpu
} from "lucide-react";
import { useShop } from "../../context/ShopContext";
import ProductCard from "../products/ProductCard";

export default function WishlistPage() {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
    sendDirectWhatsApp
  } = useShop();

  // Filter wishlisted items
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const totalValue = wishlistProducts.reduce(
    (sum, p) => sum + (p.finalPrice || p.discountPrice || p.price),
    0
  );

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((p) => {
      if (p.inStock) {
        addToCart(p, 1);
      }
    });
    setIsCartOpen(true);
  };

  const handleClearWishlist = () => {
    // Toggle all out
    wishlist.forEach((id) => toggleWishlist(id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Personal Gear Locker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              My Saved Hardware
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep track of dream builds, flagship smartphones, and pro workstations.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleClearWishlist}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>

              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All Available to Cart</span>
              </button>
            </div>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Explore our latest laptops, OLED monitors, RTX gaming rigs, and accessories. Click the heart icon on any device to save it here for later.
            </p>

            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              <Link
                to="/products?categoryId=1"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>Browse Laptops</span>
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Popular Gear Preview */}
            <div className="mt-16 pt-12 border-t border-slate-200 text-left">
              <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Trending Hardware In Egypt Right Now</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Wishlist Content */
          <div className="py-8">
            {/* Top Summary Ticker */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                  {wishlistProducts.length}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    Total Hardware Value
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    {totalValue.toLocaleString()} EGP
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Agent Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Inspect Before Payment</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => {
                const img =
                  product.primaryImageUrl ||
                  product.images?.find((i) => i.isPrimary)?.imageUrl ||
                  product.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";

                return (
                  <div
                    key={product.id}
                    className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300"
                  >
                    {/* Top actions */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        {product.brandName}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Remove from Wishlist"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image & Title */}
                    <Link
                      to={`/products/${product.id}`}
                      className="group flex flex-col items-center text-center mb-4"
                    >
                      <div className="w-full aspect-video rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-3 overflow-hidden">
                        <img
                          src={img}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 text-sm line-clamp-2 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        SKU: {product.sku}
                      </p>
                    </Link>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between text-xs mb-4 pt-3 border-t border-slate-100">
                      <span className="text-slate-500">Availability:</span>
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          In Stock ({product.stockQuantity} units)
                        </span>
                      ) : (
                        <span className="font-bold text-rose-500">Out of Stock</span>
                      )}
                    </div>

                    {/* Price and Cart Action */}
                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="text-lg font-black text-slate-900">
                            {product.finalPrice.toLocaleString()} EGP
                          </div>
                          {product.discountPrice && (
                            <div className="text-xs text-slate-400 line-through">
                              {product.price.toLocaleString()} EGP
                            </div>
                          )}
                        </div>
                        {product.discountPrice && (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Save {(product.price - product.discountPrice).toLocaleString()} EGP
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={!product.inStock}
                          onClick={() => {
                            addToCart(product, 1);
                            setIsCartOpen(true);
                          }}
                          className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            product.inStock
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => sendDirectWhatsApp(product)}
                          className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Inquire VIP</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
