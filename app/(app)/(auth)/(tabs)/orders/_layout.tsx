import { Stack } from 'expo-router';

const DriverLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default DriverLayout;
