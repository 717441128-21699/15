import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import StoreDetail from '@/pages/StoreDetail';
import Alerts from '@/pages/Alerts';
import Procurement from '@/pages/Procurement';
import Report from '@/pages/Report';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/store';
import { useEffect } from 'react';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrate } = useAppStore();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
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
          <Route path="procurement" element={<Procurement />} />
          <Route path="report" element={<Report />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
