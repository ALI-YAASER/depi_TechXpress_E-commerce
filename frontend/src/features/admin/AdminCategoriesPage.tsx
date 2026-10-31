import { useState } from "react";
import {
  Tags,
  Plus,
  Trash2,
  CheckCircle2,
  Award
} from "lucide-react";
import { MOCK_CATEGORIES, MOCK_BRANDS } from "../../services/mockData";
import type { CategoryDto, BrandDto } from "../../types/product";

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");
  const [categories, setCategories] = useState<CategoryDto[]>(MOCK_CATEGORIES);
  const [brands, setBrands] = useState<BrandDto[]>(MOCK_BRANDS);

  // Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  // Brand Modal
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandName, setBrandName] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: CategoryDto = {
      id: Date.now(),
      name: catName.trim(),
      slug: (catSlug || catName).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      parentCategoryId: null,
      isActive: true,
      productCount: 0
    };

    setCategories([...categories, newCat]);
    setShowCatModal(false);
    setCatName("");
    setCatSlug("");
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const newBrand: BrandDto = {
      id: Date.now(),
      name: brandName.trim(),
      isActive: true,
      productCount: 0
    };

    setBrands([...brands, newBrand]);
    setShowBrandModal(false);
    setBrandName("");
  };

  const handleDeleteCategory = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleDeleteBrand = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Categories & Partner Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize tech taxonomy, parent hierarchies, and authorized Egyptian agents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === "categories") setShowCatModal(true);
            else setShowBrandModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === "categories" ? "Add Category" : "Add Brand"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Tags className="w-4 h-4" />
          <span>Electronics Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brands")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "brands"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Manufacturer Brands ({brands.length})</span>
        </button>
      </div>

      {/* Tab 1: Categories Table */}
      {activeTab === "categories" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Products Linked</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    /{c.slug}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {c.productCount} SKUs
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Brands Table */}
      {activeTab === "brands" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase">
                <th className="py-3 px-4">Manufacturer Brand</th>
                <th className="py-3 px-4">Catalog Representation</th>
                <th className="py-3 px-4">Warranty Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {b.name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {b.productCount} SKUs
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authorized Agent
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteBrand(b.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-base text-slate-900 mb-4">
              Add New Electronics Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Smart Wearables & Audio"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. smart-wearables"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-base text-slate-900 mb-4">
              Add Authorized Brand
            </h3>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. NVIDIA, Corsair, Razer"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
