import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiClient.signIn(email, password);

      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData) => {
    setIsLoading(true);
    try {
      const data = await apiClient.signUp(userData);

      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;