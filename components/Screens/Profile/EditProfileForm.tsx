import { Colors } from "@/constants/theme";
import { User } from "@/hooks/useUser";
import { userService } from "@/services/userService";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditProfileFormProps {
  user: User | null;
  onSave: (updatedUser: Partial<User>) => void;
  onClose: () => void;
}

const EditProfileForm = ({ user, onSave, onClose }: EditProfileFormProps) => {
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editPassword, setEditPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    // Validate passwords match if password is being changed
    if (editPassword && editPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: { name?: string; phone?: string; password?: string } = {};

      if (editName && editName !== user?.name) {
        updateData.name = editName;
      }
      if (editPhone && editPhone !== user?.phone) {
        updateData.phone = editPhone;
      }
      if (editPassword) {
        updateData.password = editPassword;
      }

      if (Object.keys(updateData).length === 0) {
        Alert.alert("Info", "No changes to save");
        setIsSaving(false);
        return;
      }

      await userService.updateProfile(updateData);

      // Notify parent of the update
      onSave({
        name: editName || user?.name,
        phone: editPhone || user?.phone,
      });

      Alert.alert("Success", "Profile updated successfully");
      setEditPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to update profile";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Enter your name"
          autoCapitalize="words"
          editable={!isSaving}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={[styles.input, styles.inputReadOnly]}
          value={user?.email || ""}
          editable={false}
          placeholder="Email"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          value={editPhone}
          onChangeText={setEditPhone}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
          editable={!isSaving}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          value={editPassword}
          onChangeText={setEditPassword}
          placeholder="Enter new password (optional)"
          secureTextEntry
          editable={!isSaving}
        />
      </View>
      {editPassword.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            editable={!isSaving}
          />
        </View>
      )}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSaveProfile}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.muted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  inputReadOnly: {
    backgroundColor: "#f5f5f5",
    color: Colors.muted,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfileForm;
