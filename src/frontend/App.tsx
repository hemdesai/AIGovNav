/**
 * Main App Component with Routing
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { IntakeForm } from './pages/IntakeForm';
import { IntakeSuccess } from './pages/IntakeSuccess';
import { Registry } from './pages/Registry';
import { SystemDetails } from './pages/SystemDetails';
import { PolicyPacks } from './pages/PolicyPacks';
import { PolicyPackDetail } from './pages/PolicyPackDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="intake">
              <Route path="new" element={<IntakeForm />} />
              <Route path=":id/success" element={<IntakeSuccess />} />
            </Route>
            <Route path="registry" element={<Registry />} />
            <Route path="systems/:id" element={<SystemDetails />} />
            <Route path="policy-packs" element={<PolicyPacks />} />
            <Route path="policy-packs/:id" element={<PolicyPackDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;