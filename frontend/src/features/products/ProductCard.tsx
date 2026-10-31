import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star, Scale, MessageSquare } from "lucide-react";
import type { ProductListItemDto, ProductDetailDto } from "../../types/product";
import { useShop } from "../../context/ShopContext";

interface ProductCardProps {
  product: ProductListItemDto | ProductDetailDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    openQuickViewById,
    compareList,
    toggleCompare,
    sendDirectWhatsApp
  } = useShop();

  if (!product) return null;

  const isFav = wishlist.includes(product.id);
  const isComp = compareList.includes(product.id);

  const discount = Boolean(product.discountPrice && product.price > product.discountPrice)
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const imageUrl =
    product.primaryImageUrl ||
    product.images?.find((i) => i.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl;

  const displayImage =
    imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-3 sm:p-5 flex items-center justify-center">
        <Link to={`/products/${product.id}`} className="block w-full h-full flex items-center justify-center">
          <img
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            src={displayImage}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110 cursor-pointer ${
            isFav ? "text-rose-500" : "text-slate-400 hover:text-slate-700"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Quick View Button for Mobile */}
        <button
          type="button"
          className="absolute bottom-2.5 left-2.5 sm:hidden z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/80 text-cyan-400 shadow-md backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
          title="Quick View"
          aria-label="Quick View"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickViewById(product.id);
          }}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick View Hover Bar for Desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-1.5 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl backdrop-blur-md shadow-md h-9 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickViewById(product.id);
            }}
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Quick Specs View</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Meta & Rating */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 mb-1">
          <span className="font-semibold text-indigo-600 truncate max-w-[65%]">
            {product.brandName} · {product.categoryName}
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-500 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating || 4.9}</span>
            <span className="text-slate-400 text-[10px] font-normal">({product.reviewsCount || 12})</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1 leading-snug">
          <Link to={`/products/${product.id}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        {/* Stock & SKU line */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
          <span>SKU: {product.sku}</span>
          {product.inStock ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              In Stock
            </span>
          ) : (
            <span className="text-rose-500 font-semibold">Out of Stock</span>
          )}
        </div>

        {/* Price & Actions Foot */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
          {/* Prices */}
          <div className="flex flex-col min-w-0">
            {Boolean(product.discountPrice && product.price > product.discountPrice) && (
              <s className="text-[10px] sm:text-[11px] text-slate-400 line-through truncate">
                {product.price.toLocaleString()} EGP
              </s>
            )}
            <div className="flex items-baseline gap-0.5 sm:gap-1 text-sm sm:text-base font-black text-slate-900 truncate">
              <span>{product.finalPrice.toLocaleString()}</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500">EGP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Compare Button */}
            <button
              type="button"
              className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-colors cursor-pointer ${
                isComp
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
              title={isComp ? "Remove from comparison" : "Compare specifications"}
              aria-label="Compare specifications"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product.id);
              }}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Quick WhatsApp order button */}
            <button
              type="button"
              className="hidden xs:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-transform active:scale-95 shadow-sm cursor-pointer"
              title="Quick WhatsApp Order"
              aria-label="Quick WhatsApp Order"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sendDirectWhatsApp(product);
              }}
            >
              <MessageSquare className="w-4 h-4 fill-current" />
            </button>

            {/* Add to Cart button */}
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition-all active:scale-95 shadow-sm shadow-indigo-600/30 cursor-pointer"
              aria-label="Add to cart"
              title="Add to cart"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
