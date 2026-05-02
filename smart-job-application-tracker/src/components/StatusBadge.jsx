const styles = {
  Applied: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  Interview: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Offer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
};

export default function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{status}</span>;
}
