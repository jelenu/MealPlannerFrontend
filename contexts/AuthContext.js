import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

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

  useEffect(() => {
    // Load tokens from secure storage when the app starts
    const loadTokens = async () => {
      const access = await SecureStore.getItemAsync('accessToken'); // Get access token
      const refresh = await SecureStore.getItemAsync('refreshToken'); // Get refresh token
      if (access) setAccessToken(access); // Set access token if exists
      if (refresh) setRefreshToken(refresh); // Set refresh token if exists
    };
    loadTokens();
  }, []);

  // Save tokens to state and secure storage on login
  const login = async ({ access, refresh }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    await SecureStore.setItemAsync('accessToken', access); // Store access token securely
    await SecureStore.setItemAsync('refreshToken', refresh); // Store refresh token securely
  };

  // Remove tokens from state and secure storage on logout
  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    await SecureStore.deleteItemAsync('accessToken'); // Delete access token
    await SecureStore.deleteItemAsync('refreshToken'); // Delete refresh token
  };

  // Provide the context values to children components
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
