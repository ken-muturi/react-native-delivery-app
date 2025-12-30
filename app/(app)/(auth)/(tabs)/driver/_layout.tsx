import { Stack } from 'expo-router';

const DriverLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
    </Stack>
  );
};

export default DriverLayout;
