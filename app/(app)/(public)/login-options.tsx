import Login from "@/components/Auth/Login";
import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>Log in to Convient Couriers</Text>

      <Login />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  closeBtn: {
    backgroundColor: Colors.light,
    borderRadius: 40,
    padding: 8,
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.brandBlack,
    marginVertical: 22,
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
  },
  otherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  otherButtonText: {
    color: Colors.secondary,
    fontSize: 18,
    fontWeight: "600",
  },
  facebookButton: {
    backgroundColor: Colors.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  facebookButtonText: {
    color: Colors.dark,
    fontSize: 18,
    fontWeight: "600",
  },
});
export default Page;
