import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      
      // Fetch user data after login
      const userResponse = await axios.get('http://localhost:5001/api/auth/profile', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
        role
      });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
