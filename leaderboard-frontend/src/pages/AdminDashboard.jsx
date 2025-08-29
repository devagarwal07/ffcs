import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { getAllRequests, updateRequestStatus } from '../services/pointService';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Toggle dark mode
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

  // Fetch all point requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        showToast('error', 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [showToast]);

  const handleStatusChange = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);
      showToast('success', `Request ${status} successfully`);
      
      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('error', 'Failed to update request status');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('success', 'Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('error', 'Failed to logout');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 ring-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 ring-red-500/20';
      default: // pending
        return 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Background Gradient Animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 -z-10"></div>
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-blue-500/20 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              Admin <span className="text-blue-400">Dashboard</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl shadow-blue-500/10 rounded-xl border border-blue-500/20 overflow-hidden">
            {loading ? (
                <div className="text-center py-20 text-lg tracking-widest text-gray-400">
                <div className="animate-pulse">Loading Requests...</div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-blue-500/20">
                    <tr>
                        {['Student', 'Title', 'Points Requested', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                            {header}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                    {requests.map((request) => (
                        <tr key={request._id} className="hover:bg-blue-500/10 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{request.student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{request.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-bold">{request.pointsRequested}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {request.status === 'pending' && (
                            <div className="flex gap-3">
                                <button
                                onClick={() => handleStatusChange(request._id, 'approved')}
                                className="px-3 py-1.5 border border-green-500/50 text-xs font-medium rounded-md text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300"
                                >
                                Approve
                                </button>
                                <button
                                onClick={() => handleStatusChange(request._id, 'rejected')}
                                className="px-3 py-1.5 border border-red-500/50 text-xs font-medium rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-300"
                                >
                                Reject
                                </button>
                            </div>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
