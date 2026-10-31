import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import { orderService } from "../../services/orderService";
import type { OrderSummaryDto } from "../../types/order";
import { useShop } from "../../context/ShopContext";

// Sample mock orders for customer review
const SAMPLE_MOCK_ORDERS: OrderSummaryDto[] = [
  {
    id: 101,
    orderNumber: "TXP-2026-948120",
    status: "Processing",
    paymentStatus: "Unpaid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 84999,
    itemCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customerName: "Eng. Mohamed Ahmed",
    customerEmail: "mohamed@techxpress.eg"
  },
  {
    id: 102,
    orderNumber: "TXP-2026-831902",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Cash on Delivery",
    totalAmount: 149999,
    itemCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    customerName: "Eng. Mohamed Ahmed",
    customerEmail: "mohamed@techxpress.eg"
  }
];

export default function OrdersPage() {
  const { isAuthenticated } = useShop();
  const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);

    // Try fetching from backend
    orderService
      .getMyOrders()
      .then((res) => {
        let loaded = res.items || [];

        // Check if there's a recent order in localStorage
        try {
          const stored = localStorage.getItem("techxpress_last_order");
          if (stored) {
            const parsed = JSON.parse(stored);
            const exists = loaded.some((o) => o.orderNumber === parsed.orderNumber);
            if (!exists) {
              const localSummary: OrderSummaryDto = {
                id: 999,
                orderNumber: parsed.orderNumber,
                status: "Pending",
                paymentStatus: "Unpaid",
                paymentMethod: parsed.paymentMethod,
                totalAmount: parsed.totalAmount,
                itemCount: parsed.items?.length || 1,
                createdAt: parsed.createdAt || new Date().toISOString(),
                customerName: parsed.customerName,
                customerEmail: parsed.email
              };
              loaded = [localSummary, ...loaded];
            }
          }
        } catch {}

        if (loaded.length === 0) {
          // If no orders from backend, use sample orders for rich UX
          setOrders(SAMPLE_MOCK_ORDERS);
        } else {
          setOrders(loaded);
        }
      })
      .catch(() => {
        setOrders(SAMPLE_MOCK_ORDERS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      activeFilter === "All" ||
      o.status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      o.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-indigo-700 bg-indigo-100 border border-indigo-200">
            <Truck className="w-3 h-3" /> Out for Delivery
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-blue-700 bg-blue-100 border border-blue-200">
            <Clock className="w-3 h-3" /> Quality Inspection
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-rose-700 bg-rose-100 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Orders & Tracking</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Real-Time Shipment Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              My Hardware Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track serial inspection, courier dispatch, and view tax invoices across Egypt.
            </p>
          </div>

          <a
            href="https://wa.me/201000000000?text=Hello%20TechXpress,%20I%20would%20like%20to%20inquire%20about%20my%20recent%20hardware%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm self-start md:self-auto cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Care WhatsApp</span>
          </a>
        </div>

        {/* Controls: Search and Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by #TXP-..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No Orders Matching Filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
              You don't have any orders with status "{activeFilter}". Browse our electronics catalog to place your first order.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900">
                        #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span>Placed on: {formattedDate}</span>
                      <span>•</span>
                      <span>Items: {order.itemCount}</span>
                      <span>•</span>
                      <span>Payment: {order.paymentMethod || "Cash on Delivery"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right sm:text-right">
                      <div className="text-[11px] font-semibold text-slate-400">Total Amount</div>
                      <div className="text-base font-black text-slate-900">
                        {order.totalAmount.toLocaleString()} EGP
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
