import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const activeColor = '#fff';
const inactiveColor = '#2d2d2d';

export const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.icon, focused ? styles.active : styles.inactive]}>
    <Ionicons name="home" size={24} color={focused ? activeColor : inactiveColor} />
  </View>
);

export const AddIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.addButton, focused ? styles.active : styles.inactive]}>
    <Ionicons name="add" size={24} color={focused ? activeColor : inactiveColor} />
  </View>
);

export const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.profileIcon, focused ? styles.active : styles.inactive]}>
    <Ionicons name="person" size={24} color={focused ? activeColor : inactiveColor} />
  </View>
);

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    opacity: 1,
    backgroundColor: '#21005d',
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactive: {
    opacity: 0.5,
  },
  house: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#fff',
    left: 9,
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    top: 9,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 16,
  },
}); 