import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native'; 
import { ScrollView } from 'react-native-gesture-handler';

export default function Splash() {
     
    return ( 
            <View style={styles.container} >
                 <Image style={styles.image} source={ require('../../assets/pack.jpg')} /> 
            </View> 
    );
}

const styles = StyleSheet.create({
 
    container: { 
        height:'100%',
        backgroundColor: 'white',
        paddingBottom: 20, 
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:130, 
        height:130,
        alignSelf:'center'
    }
});
