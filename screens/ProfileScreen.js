import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext); // Get logout function from AuthContext

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Button title="Log out" onPress={logout} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});