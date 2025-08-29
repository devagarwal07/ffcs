import { createContext, useContext, useState, useCallback, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

// 1. Create the context
const ToastContext = createContext(null);

// 2. Create a custom hook for easy consumption
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 3. Create the ToastProvider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Function to remove a toast by its ID
  const removeToast = useCallback((id) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  // Function to show a new toast
  const showToast = useCallback((type, message) => {
    const id = Date.now() + Math.random(); // Unique ID for the toast
    const newToast = { id, type, message };
    
    setToasts(currentToasts => [...currentToasts, newToast]);

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// --- Helper Components ---

// Container for all toasts
function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
}

// A single toast notification component
function Toast({ toast, onDismiss }) {
  const { id, type, message } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
        case 'success': return 'border-green-500/30';
        case 'error': return 'border-red-500/30';
        case 'warning': return 'border-yellow-500/30';
        default: return 'border-blue-500/30';
    }
  }

  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-gray-800/80 backdrop-blur-md shadow-2xl shadow-blue-500/10 ring-1 ring-black ring-opacity-5 border ${getBorderColor()}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-100 capitalize">{type}</p>
              <p className="mt-1 text-sm text-gray-300">{message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={() => onDismiss(id)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
