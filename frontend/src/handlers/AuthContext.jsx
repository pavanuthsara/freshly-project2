import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// Function to check if the user is authenticated
const checkAuthentication = async () => {
  const token = localStorage.getItem('token') ||
                localStorage.getItem('farmerToken') ||
                document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

  if (!token) return { isAuthenticated: false, role: null };

  try {
    const response = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, role: data.role || null };
    }
    return { isAuthenticated: false, role: null };
  } catch (error) {
    console.error('Token validation failed:', error);
    return { isAuthenticated: false, role: null };
  }
};

// Clear all possible tokens
const clearStaleTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('farmerToken');
  document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=strict';
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: 'Guest', role: null });
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { isAuthenticated: authStatus, role } = await checkAuthentication();
      if (!authStatus) {
        clearStaleTokens();
      }
      setIsAuthenticated(authStatus);
      setUser(prev => ({ ...prev, role: authStatus ? role : null }));
      setLoading(false);
    };
    initializeAuth();

    const handleStorageChange = () => {
      initializeAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (data, tokenKey = 'token') => {
    console.log('AuthContext: handleLoginSuccess called with data:', data);
    localStorage.setItem(tokenKey, data.token || 'authenticated'); // Fallback for mock token
    setIsAuthenticated(true);
    setUser({ name: data.name || 'User', role: data.role || null });
    if (tokenKey === 'farmerToken') {
      setFarmerData(data);
    }
  };

  const handleLogout = () => {
    console.log('AuthContext: handleLogout called');
    clearStaleTokens();
    setIsAuthenticated(false);
    setUser({ name: 'Guest', role: null });
    setFarmerData(null);
  };

  const handleRegistrationSuccess = (data) => {
    console.log('AuthContext: handleRegistrationSuccess called with data:', data);
    handleLoginSuccess(data, 'farmerToken');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        farmerData,
        handleLoginSuccess,
        handleLogout,
        handleRegistrationSuccess,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};