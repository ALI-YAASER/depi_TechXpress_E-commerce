import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-indigo-600">TechXpress</h3>
          <p className="mt-2 text-sm text-slate-500">Your one-stop store for laptops, phones and accessories.</p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-500">
            <li><Link to="/products" className="hover:text-indigo-600">All Products</Link></li>
            <li><Link to="/recommendations" className="hover:text-indigo-600">Find My Device</Link></li>
            <li><Link to="/compare" className="hover:text-indigo-600">Compare</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Account</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-500">
            <li><Link to="/profile" className="hover:text-indigo-600">Profile</Link></li>
            <li><Link to="/orders" className="hover:text-indigo-600">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-600">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-500">
            <li>support@techxpress.com</li>
            <li>Sat – Thu, 9am – 6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TechXpress. All rights reserved.
      </div>
    </footer>
  );
}