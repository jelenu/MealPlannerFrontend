import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Config from '../config';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(null); // State for error messages
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  const handleLogin = async () => {
    try {
      // Make POST request to backend login endpoint
      const response = await fetch(`${Config.BACKEND_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ email, password }), // Send email and password in request body
      });
      const data = await response.json(); // Parse response as JSON

      // If response is OK and contains access and refresh tokens
      if (response.ok && data.access && data.refresh) {
        await login({ access: data.access, refresh: data.refresh }); // Save tokens using context
      } else {
        setError(data.message || 'Login error');
      }
    } catch (e) {
      setError('Connection error');
      console.log('Error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      /> 
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 12 },
});
