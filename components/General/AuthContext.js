import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadTokenAndUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          console.log('Token loaded from AsyncStorage:', storedToken);
          await fetchUserProfile(storedToken);  // Fetch user profile on load if token exists
        } else {
          console.log('No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      }
    };
    loadTokenAndUser();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('https://pythra.pythonanywhere.com/user/', {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('User profile fetched:', response.data);
      setUser(response.data);  // Save user profile in state
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const login = async (username, password) => {
    console.log('Attempting login with username:', username);
    try {
      const response = await axios.post('https://pythra.pythonanywhere.com/login/', {
        username,
        password,
      });
      const receivedToken = response.data.token;
      console.log('Received token from server:', receivedToken);
      setToken(receivedToken);
      await AsyncStorage.setItem('token', receivedToken);
      console.log('Token stored in AsyncStorage');

      await fetchUserProfile(receivedToken);  // Fetch user profile after login
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  };

  const logout = async () => {
    console.log('Logging out');
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      console.log('Token removed from AsyncStorage');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
