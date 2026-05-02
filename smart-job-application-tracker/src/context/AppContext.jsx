import { useEffect, useMemo, useReducer } from 'react';
import { AppContext } from './appContextCore';
import { loadStorage, saveStorage } from '../utils/storage';

const seedApplications = [
  {
    id: crypto.randomUUID(),
    company: 'NovaHR Labs',
    role: 'Frontend Intern',
    applicationDate: '2026-04-12',
    status: 'Interview',
    notes: 'Technical interview scheduled. Review React hooks and charting.',
    companyWebsite: 'https://novahr.example',
    location: 'Remote',
    deadline: '2026-05-04',
    priority: 'High',
    source: 'LinkedIn',
  },
  {
    id: crypto.randomUUID(),
    company: 'SkillBridge',
    role: 'Product Analyst Intern',
    applicationDate: '2026-04-18',
    status: 'Applied',
    notes: 'Follow up after one week.',
    companyWebsite: 'https://skillbridge.example',
    location: 'Bengaluru',
    deadline: '2026-05-07',
    priority: 'Medium',
    source: 'Campus portal',
  },
  {
    id: crypto.randomUUID(),
    company: 'TalentGrid',
    role: 'Junior React Developer',
    applicationDate: '2026-03-28',
    status: 'Offer',
    notes: 'Offer received. Compare stipend and learning scope.',
    companyWebsite: 'https://talentgrid.example',
    location: 'Hyderabad',
    deadline: '2026-05-02',
    priority: 'High',
    source: 'Referral',
  },
  {
    id: crypto.randomUUID(),
    company: 'PeoplePulse',
    role: 'HR Tech Intern',
    applicationDate: '2026-03-14',
    status: 'Rejected',
    notes: 'Rejected after resume screening. Improve ATS keywords.',
    companyWebsite: 'https://peoplepulse.example',
    location: 'Pune',
    deadline: '2026-04-02',
    priority: 'Low',
    source: 'Job board',
  },
];

const initialState = {
  applications: loadStorage('careerpilot.applications', seedApplications),
  user: loadStorage('careerpilot.user', null),
  theme: loadStorage('careerpilot.theme', 'light'),
  filters: {
    search: '',
    status: 'All',
    sort: 'newest',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.field]: action.value } };
    case 'ADD_APPLICATION':
      return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map((application) =>
          application.id === action.payload.id ? action.payload : application,
        ),
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter((application) => application.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => saveStorage('careerpilot.applications', state.applications), [state.applications]);
  useEffect(() => saveStorage('careerpilot.user', state.user), [state.user]);
  useEffect(() => saveStorage('careerpilot.theme', state.theme), [state.theme]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
