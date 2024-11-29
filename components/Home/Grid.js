import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductModal from './ProductModal';
import axios from 'axios';

const ProductSection = ({ title, data, onProductSelect, columns }) => {
  const renderItem = ({ item }) => {
    const imageUrl = `${item.product?.picture}`;
    const conUrl = `${item.condition?.picture}`;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          columns === 2 ? styles.halfWidth : styles.thirdWidth
        ]}
        onPress={() => onProductSelect(item)}
      >
        {item.condition ? (
          <View style={styles.conditionContainer}>
          <View style={styles.imagesContainer}>
            <Image
              style={styles.productImage}
              source={{ uri: imageUrl }}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            /> 
            <Text style={styles.cus}>
              +
            </Text>
            <View style={styles.conditionImageContainer}>
              <Image
                style={styles.conditionImage}
                source={{ uri: conUrl }}
                onError={(error) => console.log('Condition image load error:', error.nativeEvent.error)}
              />
              <Text style={styles.conditionPrice}>
                ₦{item.condition?.price.toLocaleString()}
              </Text>
            </View>
          </View>
          <Text style={styles.itemName}> 
            {item.productratio} {item.product?.name} to {item.conditionratio} {item.condition?.name}
          </Text>
          <Text style={styles.itemPrice}>
            ₦{item.product.price.toLocaleString()}
          </Text>
        </View>
        
        ) : (
          // Layout for items without a condition (unchanged)
          <View>
            <Image
              style={styles.productImage}
              source={{ uri: imageUrl }}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            />
            <Text style={styles.itemName}>
              {item.product?.name || 'No Name'}
            </Text>
            <Text style={styles.itemPrice}>
              ₦{item.product?.price.toLocaleString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <LinearGradient
        colors={['white', '#206bbe']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.linearGradient}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </LinearGradient>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={columns}
        key={String(columns)}   
        scrollEnabled={false} // Disable FlatList's internal scrolling to allow ScrollView to handle it
        contentContainerStyle={styles.grid}
        initialNumToRender={6}
        removeClippedSubviews={false}
      />
    </View>
  );
};

export default function Grid() {
  const [products, setProducts] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://pythra.pythonanywhere.com/app-items/');
      const data = response.data;

      // Separate products based on the presence of the 'condition' field
      const hotDealsData = data.filter(item => item.condition);
      const topSellersData = data.filter(item => !item.condition);

      setProducts(topSellersData); // "Top Sellers" will be products without a condition
      setHotDeals(hotDealsData); // "Hot Deals" will be products with a condition
      console.log('Products fetched:', data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#206bbe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
      />
      
      {/* Hot Deals Section */}
      {hotDeals.length > 0 && (
        <ProductSection title="HOT DEALS" data={hotDeals} onProductSelect={handleProductSelect} columns={2} />
      )}

      {/* Top Sellers Section */}
      {products.length > 0 && (
        <ProductSection title="TOP SELLERS" data={products} onProductSelect={handleProductSelect} columns={3} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  cus:{
    fontWeight:'600',
     fontSize:19,
     marginTop:6,
     color:'grey'
  },  
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    
  grid: {
    padding: 9,
    backgroundColor: 'white',
  },
  itemContainer: {
    margin: 7,
    backgroundColor: 'white',
    elevation: 1,
    padding: 5,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  halfWidth: {
    flex: 0.5, // Occupy half of the width for Hot Deals
  },
  thirdWidth: {
    flex: 1 / 3, // Occupy one-third of the width for Top Sellers
  },
  itemName: {
    fontSize: 12,
    margin: 3,
    textTransform: 'capitalize',
    marginTop: 'auto',
  },
  itemPrice: {
    fontSize: 13, 
    color: 'black',
    fontWeight: '600',
    margin: 4,
    textTransform: 'capitalize',
    marginTop: 'auto',
    alignSelf:'center'
  }, 
  linearGradient: {
    height: 'auto',
    padding: 4,
    paddingHorizontal:8,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 14,
    margin: 4,
  },
  productImage: {
    width: 50,
    alignSelf:'center',
    height: 50,
    marginVertical: 6,
  },
  sectionTitle: {
    color: 'white',
    fontWeight:'bold',
    fontSize: 12,
    marginLeft: 7,
  },
  conditionContainer: {
    flexDirection: 'column',
    alignItems: 'center', 
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conditionImageContainer: {
    alignItems: 'center', // Center items horizontally
  },
  conditionImage: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  conditionPrice: {
    fontSize: 10,
    marginTop: 1, // Add some space above the price
  },
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  itemName: {
    fontSize: 12,
    margin: 3,
    textTransform: 'capitalize',
    marginTop: 'auto',
  },
  itemPrice: {
    fontSize: 13, 
    color: 'black',
    fontWeight: '600',
    margin: 4,
    textTransform: 'capitalize',
    marginTop: 'auto',
    alignSelf:'center'
  }, 
  linearGradient: {
    height: 'auto',
    padding: 4,
    paddingHorizontal: 8,
    width: '96%',
    alignSelf: 'center',
    borderRadius: 14,
    margin: 4,
  },
  productImage: {
    width: 50,
    alignSelf: 'center',
    height: 50,
    marginVertical: 6,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});