import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

function ProtectedRoute({ role, component: Component }) {
  const { user, loading } = useAuth();
  const { toasts, showToast } = useToast();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    showToast('error', 'Please login first');
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to this route
  if (role === 'admin' && user.role !== 'admin') {
    showToast('error', 'Access denied');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin and trying to access admin route, allow it
  if (role === 'admin' && user.role === 'admin') {
    return (
      <div>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`fixed bottom-4 right-4 p-4 rounded-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            style={{ zIndex: 1000 }}
          >
            {toast.message}
          </div>
        ))}
        <Component />
      </div>
    );
  }

  // If user is student and trying to access student route, allow it
  if (role === 'student' && user.role === 'student') {
    return (
      <div>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`fixed bottom-4 right-4 p-4 rounded-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            style={{ zIndex: 1000 }}
          >
            {toast.message}
          </div>
        ))}
        <Component />
      </div>
    );
  }

  // If none of the above conditions match, redirect to appropriate dashboard
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

export default ProtectedRoute;
