import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import Config from '../../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setError({});
    try {
      const response = await fetch(`${Config.BACKEND_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        setError({ non_field_errors: [`Unexpected response: ${text}`] });
        return;
      }
      if (response.ok && data.access && data.refresh) {
        await login({ access: data.access, refresh: data.refresh });
      } else if (data.detail) {
        setError({ non_field_errors: [data.detail] });
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        setError(data);
      } else {
        setError({ non_field_errors: ['Login error'] });
      }
    } catch (e) {
      setError({ non_field_errors: ['Connection error'] });
      console.log('Error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
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
      {error.non_field_errors && error.non_field_errors.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      <Button title="Log in" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 8 },
  switchText: { color: '#007bff', marginTop: 16, textAlign: 'center' },
});