import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GeneralNav({name}) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.navbar}>
                <View style={styles.leftSection}>
                    <MaterialCommunityIcons name="arrow-left" size={30} color="white" />
                    <Text style={styles.titleText}>{name}</Text>
                </View>
                <View style={styles.rightSection}>
                    <FontAwesome name="user-circle" size={29} style={styles.icon} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 15,
        paddingTop:11,
        paddingHorizontal:15,
        backgroundColor: '#206bbe',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 25,
        color: 'white',
        fontWeight: '700',
        marginLeft: 10,
    },
    rightSection: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
        color: "white",
    },
});
