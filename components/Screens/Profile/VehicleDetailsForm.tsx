import { Colors } from "@/constants/theme";
import { useDriverProfile, useUpdateVehicle } from "@/hooks/useDriver";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VehicleDetailsFormProps {
  onSave: (vehicleData: VehicleData) => void;
  onClose: () => void;
}

export interface VehicleData {
  type: string;
  plate: string;
  model: string;
  photo: { uri: string; name: string } | null;
}

const VehicleDetailsForm = ({ onSave, onClose }: VehicleDetailsFormProps) => {
  const { data: driver, isLoading } = useDriverProfile();
  const updateVehicleMutation = useUpdateVehicle();
  
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePhoto, setVehiclePhoto] = useState<{ uri: string; name: string } | null>(null);

  // Populate form when driver data is loaded
  useEffect(() => {
    if (driver) {
      setVehicleType(driver.vehicleType || "");
      setVehiclePlate(driver.vehiclePlate || "");
      setVehicleModel(driver.vehicleModel || "");
      if (driver.vehiclePhoto) {
        setVehiclePhoto({ uri: driver.vehiclePhoto, name: "vehicle-photo.jpg" });
      }
    }
  }, [driver]);

  const handlePickVehiclePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setVehiclePhoto({ uri: asset.uri, name: asset.fileName || "vehicle-photo.jpg" });
    }
  };

  const handleSaveVehicle = async () => {
    const updateData: { vehicleType?: string; vehiclePlate?: string; vehicleModel?: string; vehiclePhoto?: string } = {};

    if (vehicleType) {
      updateData.vehicleType = vehicleType;
    }
    if (vehiclePlate) {
      updateData.vehiclePlate = vehiclePlate;
    }
    if (vehicleModel) {
      updateData.vehicleModel = vehicleModel;
    }
    if (vehiclePhoto) {
      updateData.vehiclePhoto = vehiclePhoto.uri;
    }

    if (Object.keys(updateData).length === 0) {
      Alert.alert("Info", "No changes to save");
      return;
    }

    updateVehicleMutation.mutate(updateData, {
      onSuccess: () => {
        onSave({
          type: vehicleType,
          plate: vehiclePlate,
          model: vehicleModel,
          photo: vehiclePhoto,
        });
        Alert.alert("Success", "Vehicle details updated successfully");
        onClose();
      },
      onError: (error: any) => {
        console.log("[VehicleDetailsForm] Error:", error);
        console.log("[VehicleDetailsForm] Error response:", error.response?.data);
        console.log("[VehicleDetailsForm] Error status:", error.response?.status);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to update vehicle details";
        Alert.alert("Error", errorMessage);
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Vehicle Type</Text>
        <TextInput
          style={styles.input}
          value={vehicleType}
          onChangeText={setVehicleType}
          placeholder="e.g. Motorcycle, Car, Van"
          editable={!updateVehicleMutation.isPending}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>License Plate</Text>
        <TextInput
          style={styles.input}
          value={vehiclePlate}
          onChangeText={setVehiclePlate}
          placeholder="Enter license plate number"
          autoCapitalize="characters"
          editable={!updateVehicleMutation.isPending}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Vehicle Model</Text>
        <TextInput
          style={styles.input}
          value={vehicleModel}
          onChangeText={setVehicleModel}
          placeholder="e.g. Honda CB125, Toyota Hiace"
          editable={!updateVehicleMutation.isPending}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Vehicle Photo</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePickVehiclePhoto}
          disabled={updateVehicleMutation.isPending}
        >
          <Ionicons name="camera-outline" size={20} color={Colors.primary} />
          <Text style={styles.uploadButtonText}>
            {vehiclePhoto ? vehiclePhoto.name : "Upload Photo"}
          </Text>
        </TouchableOpacity>
        {vehiclePhoto && (
          <TouchableOpacity
            style={styles.removeFileButton}
            onPress={() => setVehiclePhoto(null)}
          >
            <Ionicons name="close-circle" size={18} color="#d32f2f" />
            <Text style={styles.removeFileText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.saveButton, updateVehicleMutation.isPending && styles.saveButtonDisabled]}
        onPress={handleSaveVehicle}
        disabled={updateVehicleMutation.isPending}
      >
        {updateVehicleMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Vehicle Details</Text>
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
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    borderStyle: "dashed",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    color: Colors.primary,
    flex: 1,
  },
  removeFileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  removeFileText: {
    fontSize: 14,
    color: "#d32f2f",
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
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.muted,
  },
});

export default VehicleDetailsForm;
