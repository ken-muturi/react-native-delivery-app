import RestaurantHeader from "@/components/RestaurantHeader";

import { Fonts } from "@/constants/theme";
import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const scrollOffset = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Animated Header */}
      <RestaurantHeader title="Stores" scrollOffset={scrollOffset} />

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 60 }}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Stores</Text>

        {/* All Restaurants Header */}
        <Text style={styles.allRestaurantsTitle}>All stores</Text>

        {/* Restaurants List */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontFamily: Fonts.brandBold,
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  allRestaurantsTitle: {
    fontFamily: Fonts.brandBold,
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default Page;
