import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Config from '../../config';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState(''); // State for username input
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [password2, setPassword2] = useState(''); // State for password confirmation input
  const [success, setSuccess] = useState(null); // State for success message
  const [error, setError] = useState({}); // State for error messages as object
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleRegister = async () => {
    setError({});
    setSuccess(null);

    // Check if passwords match before sending request
    if (password !== password2) {
      setError({ password2: ['Passwords do not match.'] });
      return;
    }

    try {
      // Make POST request to backend register endpoint
      const response = await fetch(`${Config.BACKEND_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
        body: JSON.stringify({ username, email, password, password2 }), // Send registration data
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        setError({ non_field_errors: [`Unexpected response: ${text}`] });
        return;
      }

      if (response.ok && data.msg) {
        setSuccess(data.msg); // Show success message
        setModalVisible(true); // Show modal
        setUsername('');
        setEmail('');
        setPassword('');
        setPassword2('');
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        setError(data); // Set field errors from backend
      } else {
        setError({ non_field_errors: ['Registration error'] });
      }
    } catch (e) {
      setError({ non_field_errors: ['Connection error'] });
      console.log('Error:', e);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Login'); // Redirect to Login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error.username && error.username.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
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
      <TextInput
        placeholder="Confirm Password"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
        style={styles.input}
      />
      {error.password2 && error.password2.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      {error.non_field_errors && error.non_field_errors.map((msg, idx) => (
        <Text key={idx} style={styles.error}>{msg}</Text>
      ))}
      <Button title="Register" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.success}>{success}</Text>
            <Pressable style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 8 },
  success: { color: 'green', marginBottom: 16, textAlign: 'center' },
  switchText: { color: '#007bff', marginTop: 16, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 250,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});