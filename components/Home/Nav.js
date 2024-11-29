import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const Head = () => {
    return (
        <View style={styles.headbox}> 
            <View style={styles.fest}>
                <View style={styles.searchbox}> 
                    <Image 
                        source={require('../../assets/logo.jpg')} // Replace with your app icon
                        style={styles.icon}
                    />
                </View>
                <View style={styles.noticonbox}>
                    <FontAwesome
                        name="bell-o"
                        size={27}
                        style={styles.buttonIcon}
                    />
                    <FontAwesome
                        name="user-circle"
                        size={29}
                        style={styles.buttonIcon}
                    />
                </View>
            </View>
            <Searchbar
                style={styles.searchBar}
                icon={() => <Icon name="magnify" size={25} color="grey" />}
            />
        </View>
    );
}; 

const styles = StyleSheet.create({
    flatListContent: {
        padding: 6
    },
    fest: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headbox: {  
        backgroundColor: '#206bbe',  
    },
    searchbox: {
        flexDirection: 'row',
        flex: 1,  
        padding: 10,
    },
    searchBar: {
        width: '88%',
        padding:'auto',
        marginBottom: 11,
        height: 43, // Set the height to reduce the size of the Searchbar
        justifyContent: 'center', // Ensure content is centered
        alignSelf: 'center',
        fontSize: 16, 
        backgroundColor: 'white',
    },
    noticonbox: {
        flexDirection: 'row', 
    },
    buttonIcon: {
        margin: 8,
        color: "white",
    },
    icon: {
        width: 90,
        height: 40,
        margin: 5,
    },  
});
