import { useState } from 'react';
import { submitPointRequest } from '../services/pointService';
import { useToast } from '../hooks/useToast';


function PointRequestForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsRequested: '' // Keep as string for better input control
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert points to a number before submitting
      await submitPointRequest({
          ...formData,
          pointsRequested: Number(formData.pointsRequested)
      });
      showToast('success', 'Point request submitted successfully');
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        pointsRequested: ''
      });
    } catch (error) {
      showToast('error', 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 -z-10"></div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
            <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-wider">
                Request <span className="text-blue-400">Points</span>
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                Complete the form below to submit your request for review.
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="bg-gray-800/50 backdrop-blur-md shadow-2xl shadow-blue-500/10 rounded-xl border border-blue-500/20 py-8 px-4 sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Title
                        </label>
                        <div className="mt-1">
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-900/50 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Completed Advanced Algorithm Module"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-900/50 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Provide a brief description of the task or achievement."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="pointsRequested" className="block text-sm font-medium text-gray-300">
                            Points Requested
                        </label>
                        <div className="mt-1">
                            <input
                                id="pointsRequested"
                                name="pointsRequested"
                                type="number"
                                required
                                min="1"
                                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-900/50 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., 150"
                                value={formData.pointsRequested}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default PointRequestForm;
