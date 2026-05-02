import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/appContextCore';

const links = [
  { to: '/', label: 'Dashboard', icon: 'D' },
  { to: '/applications', label: 'Applications', icon: 'A' },
  { to: '/analytics', label: 'Analytics', icon: 'I' },
  { to: '/add', label: 'Add', icon: '+' },
];

export default function AppLayout() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  function logout() {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-lg font-black text-white dark:bg-teal-400 dark:text-slate-950">CP</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean dark:text-teal-300">CareerPilot</p>
              <h1 className="text-xl font-bold text-ink dark:text-white">Application Command Center</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-ocean text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="grid h-5 w-5 place-items-center rounded bg-white/20 text-[11px] font-black">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 md:inline-flex">
              {state.user?.name}
            </span>
            <button className="btn-secondary" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
              {state.theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button className="btn-secondary" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
