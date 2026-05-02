import { useMemo, useState } from 'react';
import { useApp } from '../context/appContextCore';
import { formatDate } from '../utils/date';
import { useDebounce } from '../utils/useDebounce';
import ApplicationForm from './ApplicationForm';
import StatusBadge from './StatusBadge';

const PAGE_SIZE = 10;

export default function ApplicationTable() {
  const { state, dispatch } = useApp();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const debouncedSearch = useDebounce(state.filters.search);

  const filtered = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    return state.applications
      .filter((application) => {
        const matchesSearch = `${application.company} ${application.role}`.toLowerCase().includes(search);
        const matchesStatus = state.filters.status === 'All' || application.status === state.filters.status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const first = new Date(a.applicationDate).getTime();
        const second = new Date(b.applicationDate).getTime();
        return state.filters.sort === 'newest' ? second - first : first - second;
      });
  }, [debouncedSearch, state.applications, state.filters.sort, state.filters.status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function saveEdit(value) {
    dispatch({ type: 'UPDATE_APPLICATION', payload: value });
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
          <input
            className="input"
            placeholder="Search company or role"
            value={state.filters.search}
            onChange={(event) => {
              setPage(1);
              dispatch({ type: 'SET_FILTER', field: 'search', value: event.target.value });
            }}
          />
          <select
            className="input"
            value={state.filters.status}
            onChange={(event) => {
              setPage(1);
              dispatch({ type: 'SET_FILTER', field: 'status', value: event.target.value });
            }}
          >
            {['All', 'Applied', 'Interview', 'Rejected', 'Offer'].map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="input" value={state.filters.sort} onChange={(event) => dispatch({ type: 'SET_FILTER', field: 'sort', value: event.target.value })}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </section>

      {editing && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink dark:text-white">Edit Application</h2>
          <ApplicationForm initialValue={editing} onSubmit={saveEdit} submitLabel="Update application" />
        </section>
      )}

      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((application) => (
                <tr key={application.id} className="align-top">
                  <td className="px-4 py-3 font-bold text-ink dark:text-white">{application.company}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{application.role}</div>
                    <div className="text-xs text-slate-500">{application.source || 'Manual entry'}</div>
                  </td>
                  <td className="px-4 py-3">{formatDate(application.applicationDate)}</td>
                  <td className="px-4 py-3">{formatDate(application.deadline)}</td>
                  <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {application.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-500 dark:text-slate-400">{application.notes || 'No notes'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-1.5" onClick={() => setEditing(application)}>Edit</button>
                      <button className="btn-danger px-3 py-1.5" onClick={() => dispatch({ type: 'DELETE_APPLICATION', payload: application.id })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="p-5 text-center text-slate-500">No applications match your filters.</p>}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p className="text-sm text-slate-500">Page {page} of {totalPages} · {filtered.length} records</p>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
            <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
