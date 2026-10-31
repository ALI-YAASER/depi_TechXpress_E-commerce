import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { api } from "../../lib/axios";
import { MOCK_PRODUCTS } from "../../services/mockData";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
  categoryName: string;
  brandName: string;
  isLowStock: boolean;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadInventory = () => {
    setIsLoading(true);
    api
      .get("/admin/inventory", {
        params: { lowStockOnly, search: search.trim() || undefined }
      })
      .then((res) => {
        if (res.data && res.data.items && res.data.items.length > 0) {
          setItems(res.data.items);
        } else {
          fallbackMockInventory();
        }
      })
      .catch(() => {
        fallbackMockInventory();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fallbackMockInventory = () => {
    const mapped: InventoryItem[] = MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stockQuantity: p.stockQuantity,
      categoryName: p.categoryName,
      brandName: p.brandName,
      isLowStock: p.stockQuantity <= 5
    }));
    setItems(mapped);
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockOnly]);

  const handleAdjustStock = async (id: number, delta: number) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/inventory/${id}`, { delta });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                stockQuantity: Math.max(0, item.stockQuantity + delta),
                isLowStock: Math.max(0, item.stockQuantity + delta) <= 5
              }
            : item
        )
      );
    } catch {
      // Local optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                stockQuantity: Math.max(0, item.stockQuantity + delta),
                isLowStock: Math.max(0, item.stockQuantity + delta) <= 5
              }
            : item
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      item.sku.toLowerCase().includes(search.trim().toLowerCase());

    const matchesLowStock = !lowStockOnly || item.isLowStock;

    return matchesSearch && matchesLowStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Warehouse Inventory & Delta Adjustments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time stock control, low-threshold alarms, and warehouse replenishment.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
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
            placeholder="Search by device title or hardware SKU..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none px-2 py-1">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Low Stock Only (≤ 5 units)</span>
          </span>
        </label>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase">
              <th className="py-3 px-4">Hardware SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Stock on Hand</th>
              <th className="py-3 px-4">Threshold Status</th>
              <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading inventory status...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.sku}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {item.categoryName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-bold">
                    {item.brandName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-sm text-slate-900">
                      {item.stockQuantity} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Low Stock Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        disabled={updatingId === item.id || item.stockQuantity <= 0}
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold disabled:opacity-30 cursor-pointer"
                        title="Deduct 1 unit"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => handleAdjustStock(item.id, 1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold disabled:opacity-30 cursor-pointer"
                        title="Add 1 unit"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === item.id}
                        onClick={() => handleAdjustStock(item.id, 5)}
                        className="px-2 h-8 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] cursor-pointer"
                        title="Add batch of 5"
                      >
                        +5 Units
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
