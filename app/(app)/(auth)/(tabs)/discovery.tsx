import { useAuthStore } from "@/hooks/use-userstore";
import { Button, Text, View } from "react-native";
const Page = () => {
  const { logout } = useAuthStore();

  return (
    <View>
      <Text>MY inside page</Text>
      <Button title="Go login" onPress={() => logout()} />
    </View>
  );
};
export default Page;
