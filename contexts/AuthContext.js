import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Config from '../config';

// Create the AuthContext with default values
export const AuthContext = createContext({
  accessToken: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null); // State for access token
  const [refreshToken, setRefreshToken] = useState(null); // State for refresh token

  // Logout function
  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    await SecureStore.deleteItemAsync('accessToken'); // Delete access token
    await SecureStore.deleteItemAsync('refreshToken'); // Delete refresh token
  };

  // Login function
  const login = async ({ access, refresh }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    await SecureStore.setItemAsync('accessToken', access); // Store access token securely
    await SecureStore.setItemAsync('refreshToken', refresh); // Store refresh token securely
  };

  // Refresh token function
  const refreshAccessToken = async (refresh) => {
    try {
      const response = await fetch(`${Config.BACKEND_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.access) {
          setAccessToken(data.access);
          await SecureStore.setItemAsync('accessToken', data.access);
          return true;
        }
      }
      throw new Error('Refresh failed');
    } catch {
      await logout();
      return false;
    }
  };

  // On mount: load tokens and try to refresh
  useEffect(() => {
    const initAuth = async () => {
      const access = await SecureStore.getItemAsync('accessToken'); // Get access token
      const refresh = await SecureStore.getItemAsync('refreshToken'); // Get refresh token
      if (refresh) {
        const refreshed = await refreshAccessToken(refresh); // Try to refresh access token
        if (refreshed) {
          setRefreshToken(refresh); // Set refresh token if refresh was successful
        }
      } else {
        await logout(); // Logout if no refresh token
      }
    };
    initAuth();
  }, []);

  // Provide the context values to children components
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
