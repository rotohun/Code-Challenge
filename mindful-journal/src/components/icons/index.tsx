import React from 'react';
import { View, StyleSheet } from 'react-native';

export const SunIcon = () => (
  <View style={[styles.icon, styles.sunIcon]} />
);

export const MoonIcon = () => (
  <View style={[styles.icon, styles.moonIcon]}>
    <View style={styles.moonCrater} />
  </View>
);

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  sunIcon: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  moonIcon: {
    backgroundColor: '#000',
    borderRadius: 20,
    transform: [{ rotate: '-120deg' }],
    overflow: 'hidden',
  },
  moonCrater: {
    position: 'absolute',
    right: -15,
    top: -15,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
}); 