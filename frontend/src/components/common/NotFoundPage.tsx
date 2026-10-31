import { Link } from "react-router-dom";
import { Cpu, ArrowRight, ShoppingBag } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <Cpu className="w-10 h-10" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-3">
        <span>Hardware Error 404</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
        Device Spec or Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        The hardware link you followed might have been unlisted, moved, or updated. Explore our latest electronics catalog below.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
        >
          <span>Browse All Electronics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
