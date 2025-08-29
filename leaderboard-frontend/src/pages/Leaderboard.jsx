import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/pointService';
import { useToast } from '../hooks/useToast';


function Leaderboard() {
  const { showToast } = useToast();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        showToast('error', 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [showToast]);

  const getRankClass = (index) => {
    switch (index) {
      case 0: return 'text-yellow-400 font-bold'; // 1st place
      case 1: return 'text-gray-300 font-bold'; // 2nd place
      case 2: return 'text-yellow-600 font-bold'; // 3rd place
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-wider">
          Global <span className="text-blue-400">Leaderboard</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl shadow-blue-500/10 rounded-xl border border-blue-500/20 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-lg tracking-widest text-gray-400">
              <div className="animate-pulse">Loading Rankings...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-blue-500/20">
                  <tr>
                    {['Rank', 'Name', 'Points', 'Role'].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {leaderboard.map((user, index) => (
                    <tr key={user._id} className="hover:bg-blue-500/10 transition-colors duration-200">
                      <td className={`px-6 py-4 whitespace-nowrap text-lg ${getRankClass(index)}`}>
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-bold">{user.points.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
