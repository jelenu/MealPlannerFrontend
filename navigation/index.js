import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { AuthContext } from '../contexts/AuthContext';

const AuthStack = createNativeStackNavigator(); // Stack navigator for authentication screens
const AppStack = createBottomTabNavigator(); // Tab navigator for main app screens

function AuthStackScreen() {
  // Authentication stack with only the Login screen
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackScreen() {
  // Main app stack with the Profile screen as a tab
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Profile" component={ProfileScreen} />
    </AppStack.Navigator>
  );
}

export default function RootNavigation() {
  const { accessToken } = useContext(AuthContext); // Get accessToken from AuthContext

  return (
    <NavigationContainer>
      {accessToken ? <AppStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
