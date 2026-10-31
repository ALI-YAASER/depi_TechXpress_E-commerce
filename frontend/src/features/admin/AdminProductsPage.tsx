import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2
} from "lucide-react";
import { productService } from "../../services/productService";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from "../../services/mockData";
import type { ProductListItemDto } from "../../types/product";
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListItemDto | null>(null);

  // Add product form
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState("1");
  const [brandId, setBrandId] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  const loadProducts = () => {
    setIsLoading(true);
    const fallbackProducts: ProductListItemDto[] = MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      discountPrice: p.discountPrice,
      finalPrice: p.finalPrice,
      stockQuantity: p.stockQuantity,
      inStock: p.inStock,
      brandId: p.brandId,
      brandName: p.brandName,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      primaryImageUrl: p.images?.find((i) => i.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || null,
      soldCount: p.soldCount ?? 0,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      badge: p.badge
    }));

    productService
      .getProducts({ pageSize: 50 })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setProducts(res.items);
        } else {
          setProducts(fallbackProducts);
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      p.sku.toLowerCase().includes(search.trim().toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      p.categoryName.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !sku.trim() || !price) {
      setFormError("Please fill out product name, SKU, and price.");
      return;
    }

    const catObj = MOCK_CATEGORIES.find((c) => c.id === Number(categoryId));
    const brandObj = MOCK_BRANDS.find((b) => b.id === Number(brandId));

    const newProduct: ProductListItemDto = {
      id: Date.now(),
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: sku.trim().toUpperCase(),
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      finalPrice: discountPrice ? parseFloat(discountPrice) : parseFloat(price),
      stockQuantity: parseInt(stock) || 10,
      inStock: parseInt(stock) > 0,
      brandId: Number(brandId),
      brandName: brandObj?.name || "TechXpress",
      categoryId: Number(categoryId),
      categoryName: catObj?.name || "Electronics",
      primaryImageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      soldCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      badge: "New Arrival"
    };

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    // Reset form
    setName("");
    setSku("");
    setPrice("");
    setDiscountPrice("");
    setImageUrl("");
  };

  const handleEditStock = (product: ProductListItemDto) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateStock = (newStock: number) => {
    if (!editingProduct) return;
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              stockQuantity: newStock,
              inStock: newStock > 0
            }
          : p
      )
    );
    setShowEditModal(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hardware SKU?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hardware Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage device specifications, pricing tiers, and stock allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or brand..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-indigo-600"
        >
          <option value="All">All Categories ({products.length})</option>
          {MOCK_CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase">
              <th className="py-3 px-4">Device Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Price (EGP)</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : filteredProducts.map((p) => {
              const img =
                p.primaryImageUrl ||
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200";

              return (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={img}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/products/${p.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 truncate block max-w-xs transition-colors"
                        >
                          {p.name}
                        </Link>
                        <span className="font-mono text-[10px] text-slate-400">
                          {p.sku}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {p.categoryName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-bold">
                    {p.brandName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900">
                      {p.finalPrice.toLocaleString()} EGP
                    </span>
                    {p.discountPrice && (
                      <span className="block text-[10px] text-rose-500 line-through">
                        {p.price.toLocaleString()} EGP
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.inStock ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {p.stockQuantity} units
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditStock(p)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                        title="Edit Stock"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Add Hardware Product</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apple MacBook Pro 16 M3 Max"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. APP-MBP16-M3"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-indigo-600"
                  >
                    {MOCK_BRANDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Price (EGP) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99999"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="89999"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Product Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Add SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-base text-slate-900 mb-1">
              Adjust Stock Level
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">
              {editingProduct.name}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Units in Warehouse
              </label>
              <input
                type="number"
                min="0"
                defaultValue={editingProduct.stockQuantity}
                id="stock-input"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("stock-input") as HTMLInputElement;
                  if (input) handleUpdateStock(parseInt(input.value) || 0);
                }}
                className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
