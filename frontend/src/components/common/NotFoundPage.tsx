import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-slate-500">Page not found</p>
      <Link to="/" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
        Back to home
      </Link>
    </div>
  );
}
