import React, { useState, useEffect, useRef } from 'react';  
import { View, Text, Image, ActivityIndicator, StyleSheet, Pressable, Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../General/AuthContext'; // Adjust path as necessary

const ProductModal = ({ visible, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const { token, user } = useAuth(); 
  const [alertMessage, setAlertMessage] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    if (product) {
      setQuantity(1); // Reset quantity when new product is selected
      setAlertMessage('');
    }
  }, [product, visible]);

  if (!product || !product.product) {
    return null;
  }

  const imageUrl = `${product.product.picture}`;
  const totalPrice = product.product.price * quantity;

  const addQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);
  
  const reduceQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const startHolding = (action) => {
    const id = setInterval(() => {
      if (action === 'increase') {
        addQuantity();
      } else if (action === 'decrease') {
        reduceQuantity();
      }
    }, 50); // Adjust interval speed as needed
    setIntervalId(id);
  };

  const stopHolding = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };
  const handleClose = () => {
    onClose();
  };
  const updateCart = async () => {
    setLoading(true); // Set loading to true before the request
    try {
      if (!token) {
        setAlertMessage('You need to be logged in to add items to the cart.');
        setLoading(false); // Reset loading state
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      };

      const cartResponse = await axios.get('http://pythra.pythonanywhere.com/cart-items/', { headers });
      const userCartItems = cartResponse.data.filter(item => item.user === user.id);

      const existingItem = userCartItems.find(item => item.product === product.product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await axios.put(
          `http://pythra.pythonanywhere.com/cart-items/${existingItem.id}/update/`, 
          { quantity: newQuantity },
          { headers }
        );
        setAlertMessage(`${product.product.name} quantity updated to ${newQuantity}`);
      } else {
        const newCartItem = {
          user: user.id,
          product: product.product.id,
          quantity: quantity,
          total: totalPrice,
        };

        await axios.post(
          'http://pythra.pythonanywhere.com/cart-items/create/',
          newCartItem,
          { headers }
        );
        setAlertMessage(`${product.product.name} added to the cart successfully!`);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      setAlertMessage('Failed to update cart. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
              <Text style={styles.productName}>{product.product.name}</Text>
              <Text style={styles.productPrice}>₦{product.product.price.toLocaleString()}</Text>
              <Text style={styles.totalPrice}>Total: ₦{totalPrice.toLocaleString()}</Text>

              <View style={styles.quantityContainer}>
                <Pressable 
                  onPress={reduceQuantity} 
                  onLongPress={() => startHolding('decrease')} 
                  onPressOut={stopHolding} 
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable 
                  onPress={addQuantity} 
                  onLongPress={() => startHolding('increase')} 
                  onPressOut={stopHolding} 
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>

              {/* Conditional rendering for the button */}
              {!alertMessage && (
                <Pressable onPress={updateCart} style={styles.Button}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.ButtonText}>Add to Cart</Text>
                  )}
                </Pressable>
              )}

              {alertMessage ? <Text style={styles.alertMessage}>{alertMessage}</Text> : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 22,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 22,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  alertMessage: {
    color: 'green',
    textTransform: 'uppercase',
    marginBottom: 15,
    fontWeight: '600',
  },
  Button: {
    backgroundColor: '#008CBA',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: '94%',
    marginTop: 15,
  },
  ButtonText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 15,
  },
});

export default ProductModal;
