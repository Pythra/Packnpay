import React from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, Image } from 'react-native'; 
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const { width: viewportWidth } = Dimensions.get('window');

const data = [
  { id: '1', title: 'Wishlist',img: require('../../assets/cute.png') }, 
  { id: '2', title: 'Become a Vendor', icon: 'user-plus' },
  { id: '3', title: 'Join Osusu Savings', icon: 'money' },
  { id: '4', title: 'Special Offers', icon: 'tag' },
  { id: '5',title: 'Special Offers', img: require('../../assets/abandoned-cart.png')},
]; 

const MyCarousel = () => {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>    
   {item.img && <Image source={item.img} style={styles.empty} />}

      <FontAwesome name={item.icon} size={14} color="grey" style={{marginVertical:'auto'}}/> 
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: { 
    marginVertical: 8,
    alignItems: 'center',
  }, 
  slide: {
    margin: 3,
    marginHorizontal: 8,

    height: 60,
    width: 70,  // Adjusted width for better display
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    // Colorful shadow effect 
    borderWidth: 0,
  }, empty:{
    height:23, width:23, 
    marginHorizontal:'auto'
  
},
  title: {
    fontSize: 11,
    fontWeight: '550',
    textAlign: 'center',
    color: 'black',
  },
});

export default MyCarousel;
