import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Image } from 'react-native';
import axios from 'axios';
import GeneralNav from '../GeneralNav';
import { useAuth } from '../General/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const handleCheckout = async () => {
  try {
    // Send order data to backend (you may already have this logic)
    await axios.post('http://pythra.pythonanywhere.com/orders/checkout/', {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    // Trigger push notification after successful checkout
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Order Placed",
        body: `${user.username} has placed an order`,
      },
      trigger: null, // Immediate notification
    });

    alert('Order placed successfully');
  } catch (err) {
    console.error('Error during checkout:', err);
    alert('Failed to place order');
  }
};


const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { token, user } = useAuth();  // Extract token and user from AuthContext
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setError(new Error('No authentication token found'));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://pythra.pythonanywhere.com/cart-items/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Fetch and filter the cart items based on user ID
        const userCartItems = response.data.filter((item) => item.user === user.id);
        setCartItems(userCartItems);
        
        // Calculate total price
        const calculatedTotal = userCartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        setTotal(calculatedTotal);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems(); 
      const interval = setInterval(fetchCartItems, 3000); // Fetch every 3 seconds

      return () => clearInterval(interval);  // Fetch items based on user authentication
    }
  }, [token, user]);

  const increaseQuantity = async (itemId) => {
    try {
      const updatedItem = cartItems.find(item => item.id === itemId);
      await axios.put(`http://pythra.pythonanywhere.com/cart-items/${itemId}/increase/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      setTotal(prevTotal => prevTotal + updatedItem.product.price);
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  const decreaseQuantity = async (itemId) => {
    try {
      const updatedItem = cartItems.find(item => item.id === itemId);
      if (updatedItem.quantity > 1) {
        await axios.put(`http://pythra.pythonanywhere.com/cart-items/${itemId}/decrease/`, {}, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
        setTotal(prevTotal => prevTotal - updatedItem.product.price);
      }
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const removedItem = cartItems.find(item => item.id === itemId);
      await axios.delete(`http://pythra.pythonanywhere.com/cart-items/${itemId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setTotal(prevTotal => prevTotal - (removedItem.quantity * removedItem.product.price));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

   
  const handleCheckout = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    };
  
    try {
      // Step 1: Create an order and get order ID
      const response = await axios.post(
        'https://pythra.pythonanywhere.com/checkout/',
        {}, // No need to send cart items here as the backend handles it
        { headers }
      );
  
      const { order_id, message } = response.data;
      console.log(message); // Log success message
      console.log(`Order ID: ${order_id}`);
  
      // Step 2: Clear the cart and reset total
      setCartItems([]);
      setTotal(0);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Placed",
          body: `${user.username} has placed an order`,
        },
        trigger: null, // Immediate notification
      });
      // Step 3: Navigate to Orders screen
      navigation.navigate('Orders');
    } catch (error) {
      console.error('Error during checkout:', error.response ? error.response.data : error.message);
    }
  };
  
  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.product.picture }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>₦{(item.quantity * item.product.price).toLocaleString()}</Text>
      </View>
      <Pressable onPress={() => decreaseQuantity(item.id)}>
        <FontAwesome name="minus-circle" size={19} style={styles.buttonIcon} />
      </Pressable>
      <Pressable onPress={() => increaseQuantity(item.id)}>
        <FontAwesome name="plus-circle" size={19} style={styles.buttonIcon} />
      </Pressable>
      <Pressable onPress={() => deleteItem(item.id)}>
        <FontAwesome name="trash" size={19} style={styles.buttonIcon} />
      </Pressable>
    </View>
  );

  if (loading) return <ActivityIndicator style={{marginTop:70}} size="large" color="grey" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  if (!cartItems.length) {
    return (    <>

    <GeneralNav name="Cart" />       
    <View style={{paddingTop:130}}>               
    <Image source={require('../../assets/abandoned-cart.png')} style={styles.empty} />
    <Text style={styles.emptyCartText}>Your cart is empty.</Text>
    </View>  
    </>

  );
  }

  return (
    <>
      <GeneralNav name="Cart" />
      <View style={styles.innerContainer}>
        <View style={styles.totalInfoContainer}>
          <Text style={styles.totalItemsText}>Total Items: {cartItems.length}</Text>
          <Text style={styles.totalTextAtTop}>Total: ₦{total.toLocaleString()}</Text>
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `item-${index}`)}
          style={styles.flatList}
        />

        <Pressable
          style={styles.Button}
          onPress={() => {
            if (cartItems.length === 0) {
              alert('No items in the cart to checkout.');
            } else {
              handleCheckout();  // No need to pass user id, token already exists in headers
            }
          }}
        >
          <Text style={styles.ButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 70,
    backgroundColor: '#ffffff',
  },
  flatList: {
    flexGrow: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 7,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '500',
    fontSize: 12,
    color: '#333',
  },
  itemDetails: {
    fontSize: 11,
    color: '#777',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 4,
  },
  buttonIcon: {
    color: 'grey',
    marginHorizontal: 8,
  },
  totalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalItemsText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  totalTextAtTop: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  Button: {
    backgroundColor: '#008CBA',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
   ButtonText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  empty:{
    height:90, width:90, 
    marginHorizontal:'auto'},
  
});

export default CartScreen;
