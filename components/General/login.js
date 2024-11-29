import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../General/AuthContext';  // Ensure the correct import path
import GeneralNav from '../GeneralNav';  // Import GeneralNav component

const LoginScreen = ({ navigation }) => { 
  const [username, setUsername] = useState('');  // State to store username
  const [password, setPassword] = useState('');  // State to store password
  const [loading, setLoading] = useState(false);  // State to show/hide loader
  const [error, setError] = useState('');  // State to display errors
  const { user, login, logout } = useAuth(); // Get user and logout function from AuthContext

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigation.navigate('Profile'); // Navigate to Login screen after logout
  };

  // Function to handle login
  const handleLogin = async () => {
    setLoading(true);  // Start the loading indicator
    setError('');  // Clear previous errors
    try {
      await login(username, password);  // Call login function from context
      navigation.navigate('Home');  // Navigate to Home screen after login
    } catch (error) {
      setError('Invalid username or password');  // Set error message
    } finally {
      setLoading(false);  // Stop the loading indicator
    }
  };

  // If user is logged in, show logout button and username
  if (user) {
    return (
      <View>
        <GeneralNav name="Profile" />
        <View style={styles.container}>

        <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View></View>
    );
  }

  // If user is not logged in, show login form
  return (
    <View>
      <GeneralNav name="Login" />
      <View style={styles.container}>

      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}  
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View></View>
  );
};

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'blue',  // Updated to match your former border styles
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,  // Add border radius for consistency
    backgroundColor: '#f9f9f9',  // Light background color
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
