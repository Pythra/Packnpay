import React from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { AuthProvider, useAuth } from './components/General/AuthContext';
import useNotification from './components/General/useNotification';  // Adjust the path if needed

import MyTabs from './components/General/MyTabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  useNotification();  // Call the custom hook here to set up notifications

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#206bbe"
          translucent={true}
        />
        <View style={styles.statusBarBackground} />
        <AuthProvider>  
          <NavigationContainer>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.tabContainer}>
                <MyTabs/>
              </View>
            </SafeAreaView>
          </NavigationContainer>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: '#206bbe',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#206bbe',
  },
  tabContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'whiteSmoke',
  },
});