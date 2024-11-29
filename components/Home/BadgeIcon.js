import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BadgeIcon = ({ name, size, color, badgeCount }) => {
  return (
    <View style={styles.iconContainer}>
      <FontAwesome name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30, // Set dimensions for the icon container
    height: 30, // Adjust size according to your icon size
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    right: -6, // Position the badge relative to the icon
    top: -3, // Adjust as needed to position correctly
    backgroundColor: 'red',
    borderRadius: 8, // For a circular badge
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold', 
  },
});

export default BadgeIcon;
