import { useAuthStore } from "@/hooks/useUser";
import { Stack } from "expo-router";

const RootNav = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log("[RootNav] isAuthenticated:", isAuthenticated);

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};
export default RootNav;
