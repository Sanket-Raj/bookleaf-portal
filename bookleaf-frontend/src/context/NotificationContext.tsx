import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{ msg: string; type: string } | null>(null);

  const notify = (msg: string, type = 'info') => {
    setNotification({ msg, type });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {notification.msg}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};