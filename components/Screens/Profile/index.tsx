import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DocumentsForm from "./DocumentsForm";
import EditProfileForm from "./EditProfileForm";
import VehicleDetailsForm from "./VehicleDetailsForm";

// SettingItem component
export type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
};

export const SettingItem = ({
  icon,
  label,
  onPress,
  showChevron = true,
  danger = false,
}: SettingItemProps) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingItemLeft}>
      <View
        style={[styles.iconContainer, danger && { backgroundColor: "#ffebee" }]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#d32f2f" : Colors.primary}
        />
      </View>
      <Text style={[styles.settingLabel, danger && { color: "#d32f2f" }]}>
        {label}
      </Text>
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
    )}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();

  // Expandable sections state
  const [isEditProfileExpanded, setIsEditProfileExpanded] = useState(false);
  const [isVehicleExpanded, setIsVehicleExpanded] = useState(false);
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || "Driver"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "driver@delivery.app"}
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View className="section" style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => setIsEditProfileExpanded(!isEditProfileExpanded)}
            />
            {isEditProfileExpanded && (
              <EditProfileForm
                user={user}
                onSave={(updatedUser) => {
                  if (user) {
                    setUser({ ...user, ...updatedUser });
                  }
                }}
                onClose={() => setIsEditProfileExpanded(false)}
              />
            )}
            <SettingItem
              icon="car-outline"
              label="Vehicle Details"
              onPress={() => setIsVehicleExpanded(!isVehicleExpanded)}
            />
            {isVehicleExpanded && (
              <VehicleDetailsForm
                onSave={(vehicleData) => {
                  console.log("Vehicle data saved:", vehicleData);
                }}
                onClose={() => setIsVehicleExpanded(false)}
              />
            )}
            <SettingItem
              icon="document-text-outline"
              label="Documents"
              onPress={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
            />
            {isDocumentsExpanded && (
              <DocumentsForm
                onSave={(documentsData) => {
                  console.log("Documents data saved:", documentsData);
                }}
                onClose={() => setIsDocumentsExpanded(false)}
              />
            )}
          </View>
        </View>
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem icon="notifications-outline" label="Notifications" />
            <SettingItem icon="location-outline" label="Delivery Zones" />
            <SettingItem icon="time-outline" label="Working Hours" />
            <SettingItem icon="language-outline" label="Language" />
          </View>
        </View>
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem icon="help-circle-outline" label="Help Center" />
            <SettingItem icon="chatbubble-outline" label="Contact Support" />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Privacy Policy"
            />
            <SettingItem icon="document-outline" label="Terms of Service" />
          </View>
        </View>
        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="log-out-outline"
              label="Logout"
              danger
              showChevron={false}
              onPress={handleLogout}
            />
          </View>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34C759",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  userEmail: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.muted,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0f7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  version: {
    textAlign: "center",
    color: Colors.muted,
    fontSize: 12,
    marginTop: 24,
  },
});

export default ProfileScreen;
