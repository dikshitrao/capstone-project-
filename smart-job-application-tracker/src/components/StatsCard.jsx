export default function StatsCard({ label, value, accent, detail }) {
  return (
    <article className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <strong className="text-3xl font-bold text-ink dark:text-white">{value}</strong>
        <span className={`h-1.5 w-12 rounded-full ${accent}`} />
      </div>
      {detail && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{detail}</p>}
    </article>
  );
}
