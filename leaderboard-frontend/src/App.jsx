import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PointRequestForm from './pages/PointRequestForm';
import Leaderboard from './pages/Leaderboard';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute role="student" component={Dashboard} />} />
          <Route path="/admin" element={<ProtectedRoute role="admin" component={AdminDashboard} />} />
          <Route path="/request" element={<ProtectedRoute role="student" component={PointRequestForm} />} />
          <Route path="/leaderboard" element={<ProtectedRoute role="student" component={Leaderboard} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
