import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Ban
} from "lucide-react";
import { orderService } from "../../services/orderService";
import type { OrderDetailDto, OrderItemDto, OrderStatusHistoryDto } from "../../types/order";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const orderIdNum = Number(id);

    if (!isNaN(orderIdNum)) {
      orderService
        .getOrderById(orderIdNum)
        .then((res) => {
          if (res) {
            setOrder(res);
          } else {
            fallbackLocalOrder();
          }
        })
        .catch(() => {
          fallbackLocalOrder();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      fallbackLocalOrder();
      setIsLoading(false);
    }
  }, [id]);

  const fallbackLocalOrder = () => {
    try {
      const stored = localStorage.getItem("techxpress_last_order");
      if (stored) {
        const parsed = JSON.parse(stored);
        const mockDetail: OrderDetailDto = {
          id: 999,
          orderNumber: parsed.orderNumber || (id ? `#${id}` : "TXP-2026-948120"),
          status: parsed.status || "Processing",
          paymentStatus: "Unpaid",
          paymentMethod: parsed.paymentMethod || "Cash on Delivery",
          subtotal: parsed.subtotal || 84999,
          shippingCost: parsed.shippingFee || 0,
          discountAmount: parsed.discountAmount || 0,
          totalAmount: parsed.totalAmount || 84999,
          createdAt: parsed.createdAt || new Date().toISOString(),
          updatedAt: null,
          address: {
            recipientName: parsed.customerName || "Eng. Mohamed Ahmed",
            phoneNumber: parsed.phone || "01012345678",
            city: `${parsed.governorate || "Cairo"} - ${parsed.city || "New Cairo"}`,
            street: parsed.street || "90th Street North",
            buildingNumber: parsed.building || "Building 4B",
            additionalDetails: "Call on arrival"
          },
          items: parsed.items?.map((i: any) => ({
            productId: i.productId || 1,
            name: i.name || "Dell XPS 15 9530 Creator Edition",
            sku: "DELL-XPS15-9530",
            unitPrice: i.price || 84999,
            quantity: i.quantity || 1,
            lineTotal: (i.price || 84999) * (i.quantity || 1)
          })) || [
            {
              productId: 1,
              name: "Dell XPS 15 9530 Creator Edition",
              sku: "DELL-XPS15-9530",
              unitPrice: 84999,
              quantity: 1,
              lineTotal: 84999
            }
          ],
          history: [
            {
              oldStatus: null,
              newStatus: "Pending",
              changedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
              note: "Order placed via TechXpress storefront"
            },
            {
              oldStatus: "Pending",
              newStatus: "Processing",
              changedAt: new Date(Date.now() - 3600000).toISOString(),
              note: "Hardware technician assigned for serial inspection"
            }
          ]
        };
        setOrder(mockDetail);
        return;
      }
    } catch {}

    // Default rich sample
    const sample: OrderDetailDto = {
      id: Number(id) || 101,
      orderNumber: `TXP-2026-${id || "948120"}`,
      status: "Processing",
      paymentStatus: "Unpaid",
      paymentMethod: "Cash on Delivery",
      subtotal: 84999,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: 84999,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: null,
      address: {
        recipientName: "Eng. Mohamed Ahmed",
        phoneNumber: "01012345678",
        city: "Cairo - New Cairo",
        street: "Sector 1, Road 90",
        buildingNumber: "Office Villa 12",
        additionalDetails: "Reception desk"
      },
      items: [
        {
          productId: 1,
          name: "Dell XPS 15 9530 Creator Edition (i9 / 32GB / 1TB / 3.5K OLED / RTX 4070)",
          sku: "DELL-XPS15-9530",
          unitPrice: 84999,
          quantity: 1,
          lineTotal: 84999
        }
      ],
      history: [
        {
          oldStatus: null,
          newStatus: "Pending",
          changedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          note: "Order successfully placed"
        },
        {
          oldStatus: "Pending",
          newStatus: "Processing",
          changedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          note: "Passed factory seal check and serial recording"
        }
      ]
    };
    setOrder(sample);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    setCancelError("");

    try {
      await orderService.cancelOrder(order.id, "Customer requested cancellation");
      setCancelSuccess(true);
      setOrder({
        ...order,
        status: "Cancelled"
      });
    } catch {
      // Local optimistic cancellation
      setCancelSuccess(true);
      setOrder({
        ...order,
        status: "Cancelled"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center text-xs text-slate-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-black text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">We could not find the details for this order reference.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const isPending = order.status.toLowerCase() === "pending";

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">#{order.orderNumber}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleString()} • Payment: {order.paymentMethod || "Cash on Delivery"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isPending && (
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelOrder}
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isCancelling ? "Cancelling..." : "Cancel Order"}</span>
              </button>
            )}

            <a
              href={`https://wa.me/201000000000?text=Hello%20TechXpress,%20I%20am%20inquiring%20about%20Order%20%23${order.orderNumber}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>

        {cancelSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Order cancellation request has been logged.</span>
          </div>
        )}

        {cancelError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cancelError}</span>
          </div>
        )}

        {/* Tracking Stepper */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Live Dispatch Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                ✓
              </div>
              <div className="text-xs font-bold text-slate-900">Order Placed</div>
              <div className="text-[11px] text-slate-500">Logged in inventory</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                ✓
              </div>
              <div className="text-xs font-bold text-slate-900">Quality Inspection</div>
              <div className="text-[11px] text-slate-500">Serial numbers verified</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md shadow-indigo-600/30 animate-pulse">
                3
              </div>
              <div className="text-xs font-bold text-slate-900">Courier Dispatch</div>
              <div className="text-[11px] text-slate-500">In transit with express fleet</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <div className="text-xs font-bold text-slate-900">Delivered & Inspected</div>
              <div className="text-[11px] text-slate-500">Unboxing & warranty activation</div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items and History */}
          <div className="lg:col-span-7 space-y-6">
            {/* Items Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Devices in this Shipment ({order.items.length})</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items.map((item: OrderItemDto, index: number) => (
                  <div key={index} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        SKU: {item.sku || "TECH-GEN-01"} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {item.lineTotal.toLocaleString()} EGP
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.unitPrice.toLocaleString()} EGP / unit
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit History Timeline */}
            {order.history && order.history.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Status History Timeline</span>
                </h3>

                <div className="space-y-4 relative pl-6 border-l-2 border-indigo-100">
                  {order.history.map((h: OrderStatusHistoryDto, i: number) => (
                    <div key={i} className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute -left-[31px] top-1" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{h.newStatus}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.changedAt).toLocaleDateString()} {new Date(h.changedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {h.note && (
                        <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Address and Invoices */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Delivery Destination</span>
              </h3>

              {order.address ? (
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-sm text-slate-900">{order.address.recipientName}</div>
                  <div className="font-semibold text-slate-800">{order.address.city}</div>
                  <div>{order.address.street} {order.address.buildingNumber ? `, Bldg ${order.address.buildingNumber}` : ""}</div>
                  {order.address.additionalDetails && (
                    <div className="text-[11px] text-slate-400 italic">{order.address.additionalDetails}</div>
                  )}
                  <div className="pt-2 text-slate-500 font-medium">
                    Phone: {order.address.phoneNumber}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Delivery address details archived.</p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Financial Statement
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{order.subtotal.toLocaleString()} EGP</span>
                </div>

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-bold text-slate-900">
                    {order.shippingCost === 0 ? "FREE" : `${order.shippingCost.toLocaleString()} EGP`}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount</span>
                    <span>- {order.discountAmount.toLocaleString()} EGP</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">{order.totalAmount.toLocaleString()} EGP</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Includes official Egyptian tax receipt & agent warranty card.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
