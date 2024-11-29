import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import GeneralNav from '../GeneralNav';
import { useAuth } from '../General/AuthContext';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchOrdersAndItems = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const ordersResponse = await axios.get('http://pythra.pythonanywhere.com/orders/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const fetchedOrders = ordersResponse.data.filter((order) => order.user === user.id);
        setOrders(fetchedOrders);

        const orderItemsResponse = await axios.get('http://pythra.pythonanywhere.com/order-items/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setOrderItems(orderItemsResponse.data);
      } catch (err) {
        setError('Failed to fetch orders and items');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndItems();
    const interval = setInterval(fetchOrdersAndItems, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [token, user]);

  const renderOrderItem = (orderId) => {
    const itemsForOrder = orderItems.filter(item => item.order === orderId);

    return (
      <View style={styles.table}> 
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Product</Text>
          <Text style={styles.tableHeadText}>Qty</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
        </View>
 
        {itemsForOrder.map(item => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>₦{item.total.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>         
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
        <Text style={styles.createdOnText}>{new Date(item.created_on).toLocaleDateString()}</Text>
      </View>

      <View style={styles.orderItems}> 
        {renderOrderItem(item.id)}
      </View>
      <Text style={styles.orderTotal}>TOTAL ₦{item.total.toLocaleString()}</Text>
      <Text
  style={[
    { color: item.status === 'pending' ? 'red' : 'green',      
     }, 
    styles.orderStatus
  ]}
>
  {item.status}
</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;
  if (!orders.length) return <Text style={styles.emptyOrderText}>You have no orders.</Text>;

  return (
    <View>
      <GeneralNav name="Orders" />
      <View style={styles.container}>        

      <FlatList
        data={orders.slice().reverse()} // Reverse the orders array
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()} // Unique key
        ListHeaderComponent={<Text style={styles.headerText}>Total Orders: {orders.length}</Text>} // Total orders is now scrollable
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 17,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  orderContainer: {
    padding: 15,
    borderWidth:0.6,
    borderColor:'grey',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 13,
    elevation: 3,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row', // Align 'Order ID' and 'Created On' in a row
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'grey'
  },
  createdOnText: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
  },
  orderTotal: {
    fontSize: 14,
    marginTop: 6,
    marginBottom:4,
    textAlign: 'right',
    fontWeight:'700'
  },
  orderStatus: {
    textTransform:'uppercase',
    textAlign: 'right',
    fontSize: 12,
    fontWeight:'bold'
  },
  
  orderItems: {
    marginTop: 10,
  },
  itemsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign:'center'
  },
  tableHeadText: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign:'right'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  productName: {
    flex: 2, // Allow product names to wrap
    fontSize: 14,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  orderItemContainer: {
    padding: 8,
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 5,
    elevation: 2,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyOrderText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  listContentContainer: {
    paddingBottom: 100, // Ensure there's space at the bottom
  },
});

export default OrderScreen;
