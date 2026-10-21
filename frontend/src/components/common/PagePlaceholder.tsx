export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-500">This page is under construction.</p>
    </div>
  );
}
