import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-600">
        <h2>Access Denied. Administrator privileges required.</h2>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded">
          <h3 className="font-semibold">Manage Users</h3>
          <p className="text-sm text-gray-600">Review and update user roles.</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-100 rounded">
          <h3 className="font-semibold">System Logs</h3>
          <p className="text-sm text-gray-600">View recent system activity.</p>
        </div>
      </div>
    </div>
  );
};