export function formatDate(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function monthKey(value) {
  const date = new Date(value);
  return date.toLocaleString('en', { month: 'short', year: '2-digit' });
}
