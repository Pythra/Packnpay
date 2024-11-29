import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { Platform } from 'react-native';

import HomeScreen from '../Home/HomeScreen';
import ProfileScreen from '../Profile/Home'; 
import CartScreen from '../Cart/CartScreen';
import BadgeIcon from '../Home/BadgeIcon';
import LoginScreen from './login';
import OrderScreen from '../Orders/OrderScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  const { isAuthenticated, user, token } = useAuth();
  const [sessionid, setSessionid] = useState(null);
  const [badgeCount, setBadgeCount] = useState(0);

  // ... (rest of your existing code remains the same) // Fetch session ID from AsyncStorage
  useEffect(() => {
    const fetchSessionId = async () => {
      const storedSessionId = await AsyncStorage.getItem('sessionid'); // Replace with actual key
      setSessionid(storedSessionId);
    };
    fetchSessionId();
  }, []);

  // Fetch cart items count periodically based on sessionid
  useEffect(() => {
    const fetchCartNum = async () => {
      const count = await getCartNum(token);
      setBadgeCount(count);
    };

    if (sessionid && user) { // Only fetch if sessionid and user exist
      fetchCartNum(); // Initial fetch
      const interval = setInterval(fetchCartNum, 3000); // Fetch every 3 seconds

      return () => clearInterval(interval); // Clear interval when component unmounts
    }
  }, [sessionid, user]);

  // Function to get the cart number based on sessionid and token
  const getCartNum = async (token) => {
    if (!token) {
      console.error('No authentication token found');
      return 0;
    }

    try {
      const response = await axios.get('http://pythra.pythonanywhere.com/cart-items/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const cartItems = response.data;

      // Filter the cart items by the authenticated user's ID
      const userItems = cartItems.filter((item) => item.user === user.id);

      return userItems.length; // Return the length of the user's cart items
    } catch (error) {
      console.error('Error fetching cart number:', error);
      return 0;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let badgeCountToDisplay = 0;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Orders') {
            iconName = 'file-text-o'; 
          } else if (route.name === 'Cart') {
            iconName = 'opencart';
            badgeCountToDisplay = badgeCount;
          } else if (route.name === 'Profile') {
            iconName = 'user-circle-o';
          }

          return <BadgeIcon name={iconName} size={size} color={color} badgeCount={badgeCountToDisplay} />;
        },
        tabBarLabel: '',
        tabBarActiveTintColor: '#058aff',
        tabBarInactiveTintColor: '#949494',
        tabBarStyle: {
                borderColor: 'white',
          position: 'absolute',
          borderTopRightRadius: 20, 
          borderTopLeftRadius:20,
          marginHorizontal: 20,
          paddingTop: 15,
          paddingBottom: Platform.OS === 'ios' ? 7 : 10, // Increased bottom padding for iOS
          height: Platform.OS === 'ios' ? 50 : 60, // Increased height for iOS
          backgroundColor: '#f5f8fc',
          marginBottom: 0,   
          justifyContent: 'center',
          alignSelf: 'center', 
           },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrderScreen} />
      <Tab.Screen name="Profile" component={isAuthenticated ? ProfileScreen : LoginScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;