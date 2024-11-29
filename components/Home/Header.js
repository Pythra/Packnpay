import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Head } from './Nav';
import MyCarousel from './Cars';

export default function Header() {
    const width = Dimensions.get('window').width;
    const data = [
        { id: '1', image: require('../../assets/bboy.jpg') },
        { id: '2', image: require('../../assets/fl.jpg') },
        { id: '3', image: require('../../assets/aff.jpg') },
        { id: '2', image: require('../../assets/soy.jpg') }, 
    ];

    const Car = () => (
        <View style={styles.carouselContainer}>
            <Carousel
                loop
                width={width}
                autoPlay={true}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Image source={item.image} style={styles.image} />
                    </View>
                )}
            />
            <View></View>
        </View>
    );

    return (
        <View>
            <View style={styles.headerContainer}>
                <Head />
            </View>
            <View style={styles.carsWrapper}>
                <Car />
            </View>
            <View style={styles.carbar}>
                <MyCarousel />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        // Removed borderRadius
    },
    carsWrapper: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        width: '100%',
        height: 99,
        backgroundColor: 'white',
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    image: {
        margin: 18,
        width: '94%',
        height: 82,
        borderRadius:15,
    },
    carbar: {
        width: '100%',
        backgroundColor: 'white',
    },
});
