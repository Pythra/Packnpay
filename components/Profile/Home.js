import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../General/AuthContext'; // Import the AuthContext

const ProfileScreen = ({ navigation }) => {
 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Profile</Text>
        {user ? (
          <>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
            {/* Add other user details as needed */}
            <Button title="Logout" onPress={handleLogout} />
          </>
        ) : (
          <Text style={styles.text}>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f9ff',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;
