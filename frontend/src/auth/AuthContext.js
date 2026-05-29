import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGetMe, apiLogin, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'vectorshift_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''
  );
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setAuthToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    setAuthToken(token);
    apiGetMe()
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken('');
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const login = async (username, password) => {
    const response = await apiLogin({ username, password });
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
    setAuthToken(response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
