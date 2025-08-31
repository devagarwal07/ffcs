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

  // Dark mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return true;
  });

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getMyRequests();
        setRequests(data);
      } catch (error) {
        console.error(error);
        showToast('error', 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, showToast]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('success', 'Logged out successfully');
    } catch {
      showToast('error', 'Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            IEEE RAS <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform"
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>
        </h2>

        {/* Points Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">Total Points</p>
          <p className="mt-3 text-6xl font-extrabold text-gray-900 dark:text-white">
            {user?.points?.toLocaleString() ?? 0}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/request"
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:shadow-md transition"
            >
              Submit Request
            </Link>
            <Link
              to="/leaderboard"
              className="px-5 py-3 rounded-xl border border-blue-400 text-blue-500 dark:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Your Requests
          </h3>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-gray-800 dark:text-gray-200">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                    <th className="px-4 py-3 text-left">Request</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-100 dark:border-gray-700 ${
                        idx % 2 === 0
                          ? 'bg-gray-50 dark:bg-gray-800/50'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <td className="px-4 py-3">{req.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === 'approved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'
                              : req.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{req.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
