import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Button, SafeAreaView } from 'react-native'; // SafeAreaView should be from 'react-native'
import axios from 'axios';
import Header from './Header';
import Grid from './Grid'; 
import { useAuth } from '../General/AuthContext'; // Adjust path as necessary

export default function HomeScreen() {
  const { token, logout } = useAuth(); // Added logout function
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await axios.get('https://pythra.pythonanywhere.com/user/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data);
        console.log(response.data);

      } catch (err) {
        setError(err.response ? err.response.data : 'An error occurred');
      }
    };

    fetchUserProfile();
  }, [token]);

  return ( 
    <SafeAreaView style={styles.safeArea}> 
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header />   
        <Grid /> 
      </View></ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView expands to fit its children
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 29,
  },
  userInfo: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});
