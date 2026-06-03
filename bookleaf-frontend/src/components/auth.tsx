import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button, Input } from './common';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { login } = useAuth();
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Placeholder for your actual API call to the Express backend
      // const response = await fetch('/api/v1/auth/login', { ... })
      
      // Simulating a successful response
      const mockUser = { id: '1', email, fullName: fullName || 'User', role: 'reader' as const };
      login('mock-jwt-token', mockUser);
      notify(isLogin ? 'Successfully logged in!' : 'Registration complete!', 'success');
    } catch (error) {
      notify('Authentication failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isLogin ? 'Welcome Back' : 'Create an Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required={!isLogin}
              placeholder="John Doe"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-blue-600 hover:underline font-semibold focus:outline-none"
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </div>
    </div>
  );
};