import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Assuming these are exported from your components directory
import { AuthView } from '../components/auth';
import { AuthorDashboard } from '../components/author';
import { AdminDashboard } from '../components/admin'; // Assuming this exists based on your structure
import { Layout } from '../components/layout';

// Helper component for protected routes
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const Pages: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="auth" element={<AuthView />} />
        <Route path="unauthorized" element={<div>Unauthorized Access</div>} />
        
        {/* Author Protected Routes */}
        <Route 
          path="author/*" 
          element={
            <ProtectedRoute allowedRoles={['author', 'admin']}>
              <AuthorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Route>
    </Routes>
  );
};