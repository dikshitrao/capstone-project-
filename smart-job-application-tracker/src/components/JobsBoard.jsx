import { useEffect, useState } from 'react';
import { fetchJobs } from '../services/jobsApi';

export default function JobsBoard() {
  const [query, setQuery] = useState('react intern');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const results = await fetchJobs(query);
        if (!ignore) setJobs(results);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [query]);

  function submit(event) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('jobSearch').trim();
    if (value) setQuery(value);
  }

  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink dark:text-white">Live Job Listings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fetched from a real job listings API.</p>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input name="jobSearch" className="input min-w-0 sm:w-56" defaultValue={query} />
          <button className="btn-primary">Search</button>
        </form>
      </div>

      {loading && <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">Loading job listings...</p>}
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {jobs.map((job) => (
          <a key={job.id} href={job.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-4 transition hover:border-ocean hover:bg-skyglass dark:border-slate-800 dark:hover:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-ink dark:text-white">{job.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{job.company}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{job.source}</span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{job.location}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
