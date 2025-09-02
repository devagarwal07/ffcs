import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/pointService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Simple console logging for auth-related messages
  const showAuthMessage = (type, message) => {
    console[type === 'error' ? 'error' : 'log'](`[Auth] ${message}`);
  };

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }, [token]);

  // Handle token refresh
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('https://ieeeras-ffcs.onrender.com/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        return data.token;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }, [token]);

  // Fetch user profile when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired()) {
        const newToken = await refreshToken();
        if (!newToken) {
          logout();
          return;
        }
      }

      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showAuthMessage('error', 'Failed to fetch user profile');
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, isTokenExpired, refreshToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://ieeeras-ffcs.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      // Fetch user profile using the new token
      try {
        const profile = await getProfile();
        setUser(profile);
        return { token: data.token, user: profile };
      } catch (e) {
        // If profile fetch fails, clear token and bubble error
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        throw new Error('Failed to load user profile after login');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('https://ieeeras-ffcs.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    // Call logout API if needed
    fetch('https://ieeeras-ffcs.onrender.com/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error);

    // Clear local state
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    token,
    isTokenExpired,
    loading,
    login,
    register,
    logout,
    setUser: updateUser,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
