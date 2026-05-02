import ApplicationTable from '../components/ApplicationTable';

export default function Applications() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-ink dark:text-white">Manage Applications</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, filter, sort, edit, delete, and page through your job search pipeline.</p>
      </div>
      <ApplicationTable />
    </div>
  );
}
