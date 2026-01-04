import { Linking, Pressable, ScrollView, StyleSheet, Text } from "react-native";

const AboutUsPage = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.heading}>About Convenient Courier Services</Text>
    <Text style={styles.subheading}>We Deliver It, The Way You Need It.</Text>
    <Text style={styles.body}>
      Convenient Courier Services Limited is your trusted partner for on-demand,
      time-sensitive, door-to-door delivery services within Nairobi, its
      environs, and across Kenya. With 9 years of experience, we leverage
      technology and local expertise to ensure smooth, efficient, and reliable
      deliveries—no matter the distance or complexity.
    </Text>
    <Text style={styles.body}>
      Our commitment to innovation means we use real-time tracking, automated
      route planning, and data-driven strategies to reduce transit times and
      enhance customer satisfaction. We serve a wide range of industries,
      including e-commerce, groceries, medical, legal, print, manufacturing, and
      more.
    </Text>
    <Text style={styles.body}>
      Whether you need to deliver parcels, cargo, sensitive documents, or
      subscription boxes, our team is dedicated to providing seamless, secure,
      and cost-effective solutions. Join thousands of satisfied clients who
      trust us to connect the world, one delivery at a time.
    </Text>
    <Pressable
      onPress={() => Linking.openURL("https://convenientcourier.co.ke/")}
      style={styles.linkContainer}
      accessibilityRole="link"
      accessibilityLabel="Visit convenientcourier.co.ke"
    >
      <Text style={styles.link}>Learn more at convenientcourier.co.ke</Text>
    </Pressable>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#5856D6",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 24,
  },
  linkContainer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: "center",
  },
});

export default AboutUsPage;
