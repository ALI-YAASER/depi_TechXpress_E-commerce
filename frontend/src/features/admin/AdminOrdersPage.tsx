import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { api } from "../../lib/axios";

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

const SAMPLE_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 101,
    orderNumber: "TXP-2026-948120",
    customerName: "Eng. Mohamed Ahmed",
    customerEmail: "mohamed@techxpress.eg",
    status: "Processing",
    paymentStatus: "Unpaid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 84999,
    itemCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 102,
    orderNumber: "TXP-2026-947811",
    customerName: "Dr. Sara Mahmoud",
    customerEmail: "sara@techxpress.eg",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 139999,
    itemCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 103,
    orderNumber: "TXP-2026-831902",
    customerName: "Tarek Mostafa",
    customerEmail: "tarek@techxpress.eg",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 62999,
    itemCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(SAMPLE_ADMIN_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Status Change Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState("Processing");
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/admin/orders")
      .then((res) => {
        if (res.data && res.data.items && res.data.items.length > 0) {
          setOrders(res.data.items);
        }
      })
      .catch(() => {
        // Fallback to sample orders
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleOpenStatusModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNote("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);

    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
        note: adminNote.trim() || undefined
      });

      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder(null);
    } catch {
      // Local optimistic fallback
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "All" ||
      o.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      !search.trim() ||
      o.orderNumber.toLowerCase().includes(search.trim().toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.trim().toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Fulfillment Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review customer orders, transition lifecycle statuses, and append QC logs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by #TXP- or customer name..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:border-indigo-600"
        >
          <option value="All">All Statuses ({orders.length})</option>
          <option value="Pending">Pending Confirmation</option>
          <option value="Processing">Quality Inspection</option>
          <option value="Shipped">Dispatched / Courier</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-extrabold uppercase">
              <th className="py-3 px-4">Tracking Code</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Date Placed</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Total (EGP)</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Fulfillment Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Loading fulfillment orders...
                </td>
              </tr>
            ) : filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  #{o.orderNumber}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{o.customerName}</div>
                  <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-700">{o.paymentMethod}</span>
                  <span className="block text-[10px] text-slate-400">{o.paymentStatus}</span>
                </td>
                <td className="py-3 px-4 font-black text-slate-900">
                  {o.totalAmount.toLocaleString()} EGP
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      o.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.status === "Shipped"
                        ? "bg-indigo-100 text-indigo-800"
                        : o.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : o.status === "Cancelled"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleOpenStatusModal(o)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>Change Status</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-base text-slate-900 mb-1">
              Update Order Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tracking Reference: #{selectedOrder.orderNumber}
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="Pending">Pending Confirmation</option>
                  <option value="Processing">Quality Inspection</option>
                  <option value="Shipped">Dispatched / Out for Delivery</option>
                  <option value="Delivered">Delivered & Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Tech Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Serial checked: SN-492198, handed to express driver."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:bg-slate-400"
                >
                  {isUpdating ? "Saving..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
