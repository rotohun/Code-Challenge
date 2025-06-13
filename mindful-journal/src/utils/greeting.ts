export const getGreeting = (date: Date = new Date()): string => {
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return 'good morning.';
  } else if (hours >= 12 && hours < 18) {
    return 'good afternoon.';
  } else {
    return 'good night.';
  }
}; 