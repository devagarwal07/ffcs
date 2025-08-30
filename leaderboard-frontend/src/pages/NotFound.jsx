import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-medium text-gray-700 dark:text-gray-300">Page Not Found</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
