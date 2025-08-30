import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { getMyRequests } from '../services/pointService';


function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('darkMode') === 'true';
    }
    return true; // Default to dark mode for this theme
  });
  
  // Fetch user's point requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getMyRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        showToast('error', 'Failed to load your requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [user, showToast]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Effect to apply dark mode class to <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);
  
  const handleLogout = async () => {
    try {
      await logout();
      showToast('success', 'Logged out successfully');
    } catch (error) {
      showToast('error', 'Logout failed');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans transition-colors duration-300">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 -z-10"></div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-blue-500/20 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              IEEE RAS <span className="text-blue-400">Student Dashboard</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              >
                {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-300 group"
              >
                <span>Logout</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100">Welcome back, <span className="text-blue-400">{user.name}</span>!</h2>
            <p className="mt-2 text-lg text-gray-400">Here's a summary of your progress.</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl shadow-blue-500/10 rounded-xl border border-blue-500/20 p-8 text-center">
            <p className="text-sm font-medium text-blue-300 uppercase tracking-wider">Total Points</p>
            <p className="mt-2 text-6xl font-extrabold text-white tracking-tight">{user.points.toLocaleString()}</p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/request"
                className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-transform transform hover:scale-105"
              >
                Submit Point Request
              </Link>
              <Link
                to="/leaderboard"
                className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-blue-500/50 text-base font-medium rounded-md text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-transform transform hover:scale-105"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
