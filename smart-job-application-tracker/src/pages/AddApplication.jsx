import { useNavigate } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import { useApp } from '../context/appContextCore';

export default function AddApplication() {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  function submit(application) {
    dispatch({ type: 'ADD_APPLICATION', payload: application });
    navigate('/applications');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-ink dark:text-white">Add Application</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Complete each step to keep records consistent for analytics.</p>
      </div>
      <ApplicationForm onSubmit={submit} submitLabel="Add application" />
    </div>
  );
}
