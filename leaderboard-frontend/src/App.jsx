import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PointRequestForm from './pages/PointRequestForm';
import Leaderboard from './pages/Leaderboard';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="student">
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/request" element={
          <ProtectedRoute role="student">
            <PointRequestForm />
          </ProtectedRoute>
        } />
        
        <Route path="/leaderboard" element={
          <ProtectedRoute role="student">
            <Leaderboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Default and 404 Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
