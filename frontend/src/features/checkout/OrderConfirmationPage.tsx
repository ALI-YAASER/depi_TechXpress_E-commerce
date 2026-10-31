import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  MessageSquare,
  Clock,
  ShoppingBag
} from "lucide-react";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Read cached order details from localStorage
    try {
      const stored = localStorage.getItem("techxpress_last_order");
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
  }, [id]);

  const orderNumber = id || orderData?.orderNumber || `TXP-2026-892147`;
  const customerName = orderData?.customerName || "Valued TechXpress Customer";
  const items = orderData?.items || [];
  const totalAmount = orderData?.totalAmount || 0;
  const paymentMethod = orderData?.paymentMethod || "Cash on Delivery";
  const governorate = orderData?.governorate || "Cairo";

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed & Logged
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Thank You for Your Order, {customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
            Your high-performance hardware order has been registered in the TechXpress system. Our engineers are preparing your package for official seal inspection.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Tracking Number:</span>
            <span className="font-mono font-black text-indigo-600 select-all">#{orderNumber}</span>
          </div>
        </div>

        {/* Fulfillment Timeline Progress */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Fulfillment & Dispatch Pipeline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2 shadow-sm">
                ✓
              </div>
              <div className="text-xs font-black text-slate-900">Order Received</div>
              <div className="text-[11px] text-slate-500">System logged & verified</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md shadow-indigo-600/30 animate-pulse">
                2
              </div>
              <div className="text-xs font-black text-slate-900">Quality Inspection</div>
              <div className="text-[11px] text-slate-500">Serial & factory seal check</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <div className="text-xs font-black text-slate-900">Courier Handover</div>
              <div className="text-[11px] text-slate-500">Express dispatch to {governorate}</div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <div className="text-xs font-black text-slate-900">Buyer Unboxing</div>
              <div className="text-[11px] text-slate-500">Inspect before final payment</div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Information */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Delivery Details</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Recipient:</span>
                <span className="font-bold text-slate-900">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{orderData?.phone || "01000000000"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Governorate:</span>
                <span className="font-bold text-slate-900">{governorate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Address:</span>
                <span className="font-bold text-slate-900 text-right">{orderData?.street || "Cairo"}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-600">24 – 48 Hours</span>
              </div>
            </div>
          </div>

          {/* Payment & Security */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment & Warranties</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Payment Option:</span>
                <span className="font-bold text-slate-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Total Due Upon Delivery:</span>
                <span className="text-base font-black text-indigo-600">
                  {totalAmount.toLocaleString()} EGP
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-500">Hardware Warranty:</span>
                <span className="font-bold text-slate-900">2-Year Official Egypt Agent</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Replacement Policy:</span>
                <span className="font-bold text-slate-900">14-Day Free Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Order Breakdown */}
        {items.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-8">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              Itemized Devices ({items.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200"}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    {(item.price * item.quantity).toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions & WhatsApp Support */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <span>View All Orders</span>
            </Link>
          </div>

          <a
            href={`https://wa.me/201000000000?text=Hello%20TechXpress,%20I%20would%20like%20live%20updates%20for%20order%20%23${orderNumber}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Track on WhatsApp Live</span>
          </a>
        </div>
      </div>
    </div>
  );
}
