import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './common';

export const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Route protection logic
  if (!user || (user.role !== 'author' && user.role !== 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Restricted Access</h2>
        <p className="text-gray-600">You must be a registered author to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Author Workspace</h2>
          <p className="text-gray-600 mt-1">Manage your drafts, publications, and analytics.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          + New Draft
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for Author's Works */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">The Silent Echo</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Draft</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Last edited 2 days ago.</p>
          <div className="flex space-x-2 text-sm">
            <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Beyond the Horizon</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Published</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Published on Oct 12, 2023.</p>
          <div className="flex space-x-2 text-sm">
            <button className="text-blue-600 hover:text-blue-800 font-medium">View Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
};