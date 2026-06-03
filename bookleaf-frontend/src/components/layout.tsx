import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">BookLeaf</h1>
        <nav>
          {user ? <span>Welcome, {user.email}</span> : <span>Guest</span>}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} BookLeaf Development. All rights reserved.</p>
      </footer>
    </div>
  );
};