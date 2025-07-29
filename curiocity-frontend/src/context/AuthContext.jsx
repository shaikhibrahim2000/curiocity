import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  axios.defaults.headers.common['x-auth-token'] = token;

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const login = async (userData) => {
    const res = await axios.post('/api/auth/login', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };