import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/appContextCore';

export default function ProtectedRoute() {
  const { state } = useApp();
  return state.user ? <Outlet /> : <Navigate to="/login" replace />;
}
