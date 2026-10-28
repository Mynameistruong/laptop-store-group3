import { useContext, createContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ProtectedRouteContext = createContext(null);

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length && !roles.includes(user.role)) {
    showToast('Bạn không có quyền truy cập', 'danger');
    return <Navigate to="/" replace />;
  }

  return children;
}

export function useProtectedRoute() {
  return useContext(ProtectedRouteContext);
}
