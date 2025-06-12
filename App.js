import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigation from './navigation';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
