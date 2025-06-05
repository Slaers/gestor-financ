import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useUserStore } from './store/userStore'; // Import store

const App: React.FC = () => {
  const token = useUserStore.getState().token; // Check initial token state

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add other protected routes here e.g. <Route path="/profile" element={<ProfilePage />} /> */}
      </Route>

      {/* Default redirect logic:
          - If logged in and trying to access root, go to dashboard.
          - If not logged in, or any other path, go to login.
          - This needs to be the last route.
      */}
      <Route
        path="*"
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
