import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ClipboardList, Warehouse, Store } from "lucide-react";
import { cn } from "../../lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories & Brands", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-slate-800 bg-slate-900 text-slate-200 md:min-h-screen md:w-64 md:border-b-0">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <span className="text-lg font-bold text-white">TechXpress Admin</span>
          <Link to="/" className="flex items-center gap-1 text-xs text-slate-400 hover:text-white md:mt-1">
            <Store className="h-3.5 w-3.5" /> Back to store
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3 md:pb-0">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-3 text-sm text-slate-500">
          Admin Panel
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}