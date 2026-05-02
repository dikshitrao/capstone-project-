import { useMemo } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import StatsCard from '../components/StatsCard';
import { useApp } from '../context/appContextCore';
import { monthKey } from '../utils/date';

export default function Analytics() {
  const { state } = useApp();

  const data = useMemo(() => {
    const monthly = {};
    const status = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
    state.applications.forEach((application) => {
      monthly[monthKey(application.applicationDate)] = (monthly[monthKey(application.applicationDate)] || 0) + 1;
      status[application.status] += 1;
    });

    const interviews = status.Interview;
    const offers = status.Offer;
    const total = state.applications.length || 1;

    return {
      monthlyData: Object.entries(monthly).map(([month, applications]) => ({ month, applications })),
      statusData: Object.entries(status).map(([name, value]) => ({ name, value })),
      interviewRate: Math.round((interviews / total) * 100),
      offerRate: Math.round((offers / total) * 100),
      activePipeline: status.Applied + status.Interview,
    };
  }, [state.applications]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink dark:text-white">Interview Analytics</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track conversion patterns and improve your job search strategy.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Interview Rate" value={`${data.interviewRate}%`} accent="bg-gold" />
        <StatsCard label="Offer Rate" value={`${data.offerRate}%`} accent="bg-emerald-500" />
        <StatsCard label="Active Pipeline" value={data.activePipeline} accent="bg-ocean" />
      </section>
      <AnalyticsCharts monthlyData={data.monthlyData} statusData={data.statusData} />
      <section className="panel p-5">
        <h3 className="text-lg font-bold text-ink dark:text-white">Search Efficiency Notes</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Insight title="Follow-up focus" value="Prioritize Applied records older than 7 days." />
          <Insight title="Resume signal" value="Rejected records are useful for spotting keyword gaps." />
          <Insight title="Interview prep" value="Use notes to track topics asked and improve repeat attempts." />
        </div>
      </section>
    </div>
  );
}

function Insight({ title, value }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <h4 className="font-bold text-ink dark:text-white">{title}</h4>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{value}</p>
    </article>
  );
}
