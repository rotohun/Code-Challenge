import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  message?: string;
};

export const LoadingScreen: React.FC<Props> = ({ 
  message = "Processing with AI" 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.message}>
          {message}
        </Text>
        <View style={styles.dotsContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
        <Text variant="bodyMedium" style={styles.subtitle}>
          This may take a few moments
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  subtitle: {
    color: '#757575',
  },
}); 