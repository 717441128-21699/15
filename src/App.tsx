import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import StoreDetail from '@/pages/StoreDetail';
import { Alerts } from '@/pages/Alerts';
import { Procurement } from '@/pages/Procurement';
import { Report } from '@/pages/Report';
import { useAppStore } from '@/store';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, user } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="store/:id" element={<StoreDetail />} />

        <Route path="alerts" element={<Alerts />} />

        <Route
          path="procurement"
          element={
            <RequireAuth allowedRoles={['headquarters', 'region']}>
              <Procurement />
            </RequireAuth>
          }
        />

        <Route path="report" element={<Report />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
