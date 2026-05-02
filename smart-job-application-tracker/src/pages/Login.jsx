import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/appContextCore';

export default function Login() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name').trim();
    const email = form.get('email').trim();

    if (!name || !email.includes('@')) {
      setError('Enter your name and a valid email to continue.');
      return;
    }

    dispatch({ type: 'LOGIN', payload: { name, email, loginAt: new Date().toISOString() } });
    navigate('/');
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8 text-slate-900 dark:text-slate-100">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-ink p-8 text-white dark:bg-slate-950">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">CareerPilot</p>
          <h1 className="mt-5 max-w-lg text-4xl font-black leading-tight">Turn every job application into a trackable pipeline.</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['CRUD tracker', 'Interview analytics', 'Live job API'].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-3 text-sm font-semibold">{item}</div>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-white/10 p-4">
            <p className="text-sm text-slate-200">Demo login: use any name and valid email. Your session and applications are saved locally in this browser.</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Student workspace</p>
        <h2 className="mt-2 text-3xl font-bold text-ink dark:text-white">Login</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start a protected local session and continue your job search dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Name</span>
            <input name="name" className="input" placeholder="Student name" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Email</span>
            <input name="email" className="input" placeholder="student@example.com" />
          </label>
          {error && <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
          <button className="btn-primary w-full">Login</button>
        </form>
        </div>
      </section>
    </main>
  );
}
