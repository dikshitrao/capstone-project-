import { useMemo } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import JobsBoard from '../components/JobsBoard';
import PipelineBoard from '../components/PipelineBoard';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/appContextCore';
import { formatDate, monthKey } from '../utils/date';

function buildAnalytics(applications) {
  const monthly = {};
  const status = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };

  applications.forEach((application) => {
    const month = monthKey(application.applicationDate);
    monthly[month] = (monthly[month] || 0) + 1;
    status[application.status] += 1;
  });

  return {
    monthlyData: Object.entries(monthly).map(([month, applications]) => ({ month, applications })),
    statusData: Object.entries(status).map(([name, value]) => ({ name, value })),
  };
}

export default function Dashboard() {
  const { state } = useApp();
  const analytics = useMemo(() => buildAnalytics(state.applications), [state.applications]);
  const recent = useMemo(() => state.applications.slice(0, 5), [state.applications]);

  const counts = useMemo(() => ({
    interviews: state.applications.filter((item) => item.status === 'Interview').length,
    offers: state.applications.filter((item) => item.status === 'Offer').length,
    rejections: state.applications.filter((item) => item.status === 'Rejected').length,
    applied: state.applications.filter((item) => item.status === 'Applied').length,
  }), [state.applications]);

  const nextActions = useMemo(() => {
    return [...state.applications]
      .filter((item) => item.status !== 'Rejected')
      .sort((a, b) => new Date(a.deadline || a.applicationDate) - new Date(b.deadline || b.applicationDate))
      .slice(0, 4);
  }, [state.applications]);

  const offerRate = state.applications.length ? Math.round((counts.offers / state.applications.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="panel overflow-hidden p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean dark:text-teal-300">Today&apos;s command center</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black text-ink dark:text-white md:text-4xl">
            Hi {state.user?.name}, your job search has {state.applications.length} tracked moves and a {offerRate}% offer signal.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Keep the pipeline warm by following up on deadlines, preparing for interviews, and learning from rejected applications.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="surface p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Active pipeline</p>
              <p className="mt-2 text-2xl font-black text-ink dark:text-white">{counts.applied + counts.interviews}</p>
            </div>
            <div className="surface p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Conversion</p>
              <p className="mt-2 text-2xl font-black text-ink dark:text-white">{offerRate}%</p>
            </div>
            <div className="surface p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Interviews</p>
              <p className="mt-2 text-2xl font-black text-ink dark:text-white">{counts.interviews}</p>
            </div>
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink dark:text-white">Next Actions</h2>
          <div className="mt-4 space-y-3">
            {nextActions.map((application) => (
              <article key={application.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink dark:text-white">{application.company}</h3>
                    <p className="text-xs text-slate-500">{application.role}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <p className="mt-2 text-xs font-semibold text-ocean dark:text-teal-300">Follow up by {formatDate(application.deadline || application.applicationDate)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Applications" value={state.applications.length} accent="bg-ocean" detail="All tracked roles" />
        <StatsCard label="Interviews" value={counts.interviews} accent="bg-gold" detail="Prep opportunities" />
        <StatsCard label="Offers" value={counts.offers} accent="bg-emerald-500" detail="Wins to compare" />
        <StatsCard label="Rejections" value={counts.rejections} accent="bg-coral" detail="Signals to learn from" />
      </section>

      <PipelineBoard applications={state.applications} />

      <AnalyticsCharts monthlyData={analytics.monthlyData} statusData={analytics.statusData} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="panel p-5">
          <h2 className="text-lg font-bold text-ink dark:text-white">Recent Applications</h2>
          <div className="mt-4 space-y-3">
            {recent.map((application) => (
              <article key={application.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink dark:text-white">{application.company}</h3>
                    <p className="text-sm text-slate-500">{application.role} | {formatDate(application.applicationDate)}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </article>
            ))}
          </div>
        </div>
        <JobsBoard />
      </section>
    </div>
  );
}
