import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Config from '../config';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState({}); // State for error messages as object
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  const handleLogin = async () => {
    setError({}); // Clear previous errors
    try {
      // Make POST request to backend login endpoint
      const response = await fetch(`${Config.BACKEND_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ email, password }), // Send email and password in request body
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        setError({ non_field: [`Unexpected response: ${text}`] });
        return;
      }

      // If response is OK and contains access and refresh tokens
      if (response.ok && data.access && data.refresh) {
        await login({ access: data.access, refresh: data.refresh }); // Save tokens using context
      } else if (data.detail) {
        setError({ non_field: [data.detail] }); // Show backend error message
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        setError(data); // Set field errors from backend
      } else {
        setError({ non_field: ['Login error'] });
      }
    } catch (e) {
      setError({ non_field: ['Connection error'] }); // Set connection error message
      console.log('Error:', e); // Log error to console
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      {error.email && error.email.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error.password && error.password.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      {error.non_field && error.non_field.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      <Button title="Log in" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 }, // Container style
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 }, // Input style
  error: { color: 'red', marginBottom: 8 }, // Error message style
});
