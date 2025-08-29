import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function ProtectedRoute({ role, children }) {
  const { user, loading, isTokenExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Check authentication
  if (!user || (isTokenExpired && isTokenExpired())) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check authorization
  if (role && user.role !== role) {
    // Redirect to default route based on user role
    const defaultRoute = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  // Render the protected component
  return children;
}

export default ProtectedRoute;
