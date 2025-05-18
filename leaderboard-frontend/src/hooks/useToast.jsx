import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [
      ...prev,
      { id, type, message, timestamp: Date.now() }
    ]);

    // Remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}
