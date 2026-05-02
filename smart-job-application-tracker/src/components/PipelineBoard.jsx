import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/date';

const columns = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function PipelineBoard({ applications }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink dark:text-white">Pipeline Board</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">A quick visual read of where every opportunity stands.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {columns.map((status) => {
          const cards = applications.filter((item) => item.status === status).slice(0, 3);
          return (
            <div key={status} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-3 flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="text-xs font-bold text-slate-500">{applications.filter((item) => item.status === status).length}</span>
              </div>
              <div className="space-y-2">
                {cards.map((application) => (
                  <article key={application.id} className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-900">
                    <h3 className="text-sm font-bold text-ink dark:text-white">{application.company}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{application.role}</p>
                    <p className="mt-2 text-xs font-semibold text-ocean dark:text-teal-300">Due {formatDate(application.deadline || application.applicationDate)}</p>
                  </article>
                ))}
                {cards.length === 0 && <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-slate-700">No records</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
