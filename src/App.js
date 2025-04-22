import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import LegalCaseManagement from './pages/LegalCaseManagement';
import ClientManagement from './pages/ClientManagement';
import AttorneyCalendar from './pages/AttorneyCalendar';
import AppointmentForm from './pages/AppointmentForm';
import PaymentManagement from './pages/PaymentManagement';
import SecretaryManagement from './pages/SecretaryManagement';
import SessionManagement from './pages/SessionManagement';
import Settings from './pages/Settings';
import NavDash from './components/NavDash';
import Profile from './pages/Profile';

// Protected Route Component
function ProtectedRoute({ children, token }) {
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register setToken={handleSetToken} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


{/* ------------------------------------------ */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-case-management"
          element={
            <ProtectedRoute token={token}>
              <LegalCaseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-management"
          element={
            <ProtectedRoute token={token}>
              <ClientManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute token={token}>
              <AttorneyCalendar />
            </ProtectedRoute>
          }
        />


        
        <Route
          path="/appointment/:mode"
          element={
            <ProtectedRoute token={token}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-management"
          element={
            <ProtectedRoute token={token}>
              <PaymentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute token={token}>
              <SessionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/secretary-management"
          element={
            <ProtectedRoute token={token}>
              <SecretaryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute token={token}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;