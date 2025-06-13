import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { getGreeting } from '../utils/greeting';

export const Greeting: React.FC = () => {
    const [greeting, setGreeting] = useState(getGreeting());

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);
  return <Text variant="displaySmall" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{greeting}</Text>;
};