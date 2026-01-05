import ProfileScreen from "@/components/Screens/Profile";
import { StyleSheet, View } from "react-native";
const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Profile;
