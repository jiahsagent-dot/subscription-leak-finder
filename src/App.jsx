import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { isDemoMode } from '@/lib/firebase';
import AppShell from '@/components/Layout/AppShell';

import LoginScreen       from '@/components/Auth/LoginScreen';
import RegisterScreen    from '@/components/Auth/RegisterScreen';
import DashboardPage     from '@/pages/DashboardPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import AddSubscriptionPage from '@/pages/AddSubscriptionPage';
import WastePage         from '@/pages/WastePage';
import GuidesPage        from '@/pages/GuidesPage';
import SettingsPage      from '@/pages/SettingsPage';
import CSVImportPage     from '@/pages/CSVImportPage';

const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
  // Demo mode: always authenticated
  return (isDemoMode || user) ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (!isDemoMode && loading) return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login"    element={(isDemoMode || user) ? <Navigate to="/" replace /> : <LoginScreen />} />
      <Route path="/register" element={(isDemoMode || user) ? <Navigate to="/" replace /> : <RegisterScreen />} />

      <Route path="/*" element={
        <Guard>
          <AppShell>
            <Routes>
              <Route path="/"        element={<DashboardPage />} />
              <Route path="/subs"    element={<SubscriptionsPage />} />
              <Route path="/subs/add" element={<AddSubscriptionPage />} />
              <Route path="/waste"   element={<WastePage />} />
              <Route path="/guides"  element={<GuidesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/import"  element={<CSVImportPage />} />
              <Route path="*"        element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </Guard>
      } />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
);

export default App;
