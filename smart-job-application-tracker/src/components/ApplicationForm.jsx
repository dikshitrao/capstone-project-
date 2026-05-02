import { useMemo, useState } from 'react';

const statuses = ['Applied', 'Interview', 'Rejected', 'Offer'];

const blankForm = {
  company: '',
  role: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  deadline: '',
  status: 'Applied',
  companyWebsite: '',
  location: '',
  source: '',
  priority: 'Medium',
  notes: '',
};

export default function ApplicationForm({ initialValue, onSubmit, submitLabel = 'Save application' }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialValue || blankForm);
  const [errors, setErrors] = useState({});

  const stepFields = useMemo(
    () => ({
      1: ['role', 'applicationDate', 'status'],
      2: ['company', 'location'],
      3: ['notes'],
    }),
    [],
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validate(currentStep = step) {
    const nextErrors = {};
    stepFields[currentStep].forEach((field) => {
      if (field !== 'notes' && !String(form[field] || '').trim()) {
        nextErrors[field] = 'This field is required.';
      }
    });
    if (currentStep === 3 && form.notes.length > 500) {
      nextErrors.notes = 'Notes must stay under 500 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (validate()) setStep((current) => Math.min(3, current + 1));
  }

  function submit(event) {
    event.preventDefault();
    if (!validate(3)) return;
    onSubmit({ ...form, id: initialValue?.id || crypto.randomUUID() });
  }

  return (
    <form onSubmit={submit} className="panel p-5">
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {['Job details', 'Company', 'Strategy'].map((label, index) => {
          const item = index + 1;
          return (
          <button
            key={item}
            type="button"
            onClick={() => item < step && setStep(item)}
            className={`rounded-md px-3 py-2 text-sm font-bold ${
              step === item ? 'bg-ocean text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {item}. {label}
          </button>
          );
        })}
      </div>

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Job role" error={errors.role}>
            <input className="input" value={form.role} onChange={(event) => update('role', event.target.value)} />
          </Field>
          <Field label="Application date" error={errors.applicationDate}>
            <input className="input" type="date" value={form.applicationDate} onChange={(event) => update('applicationDate', event.target.value)} />
          </Field>
          <Field label="Deadline / follow-up date">
            <input className="input" type="date" value={form.deadline || ''} onChange={(event) => update('deadline', event.target.value)} />
          </Field>
          <Field label="Status" error={errors.status}>
            <select className="input" value={form.status} onChange={(event) => update('status', event.target.value)}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority || 'Medium'} onChange={(event) => update('priority', event.target.value)}>
              {['High', 'Medium', 'Low'].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" error={errors.company}>
            <input className="input" value={form.company} onChange={(event) => update('company', event.target.value)} />
          </Field>
          <Field label="Location" error={errors.location}>
            <input className="input" value={form.location} onChange={(event) => update('location', event.target.value)} />
          </Field>
          <Field label="Company website">
            <input className="input" value={form.companyWebsite} onChange={(event) => update('companyWebsite', event.target.value)} />
          </Field>
          <Field label="Source">
            <input className="input" placeholder="LinkedIn, referral, campus portal" value={form.source || ''} onChange={(event) => update('source', event.target.value)} />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
            Add interview topics, recruiter names, salary/stipend notes, or follow-up reminders. This makes the analytics page more useful later.
          </div>
          <Field label="Additional notes" error={errors.notes}>
            <textarea className="input min-h-36" value={form.notes} onChange={(event) => update('notes', event.target.value)} />
          </Field>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <button type="button" className="btn-secondary" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>
          Previous
        </button>
        {step < 3 ? (
          <button type="button" className="btn-primary" onClick={next}>
            Next
          </button>
        ) : (
          <button className="btn-primary" type="submit">
            {submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-medium text-red-600">{error}</span>}
    </label>
  );
}
