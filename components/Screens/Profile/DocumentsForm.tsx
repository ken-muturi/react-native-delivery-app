import { Colors } from "@/constants/theme";
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

interface DocumentsFormProps {
  onSave: (documentsData: DocumentsData) => void;
  onClose: () => void;
}

export interface DocumentsData {
  licenseNumber: string;
  licenseExpiry: string;
  insuranceNumber: string;
  insuranceExpiry: string;
}

const DocumentsForm = ({ onSave, onClose }: DocumentsFormProps) => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDocuments = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to update documents
      // await driverService.updateDocuments({ licenseNumber, licenseExpiry, insuranceNumber, insuranceExpiry });

      onSave({
        licenseNumber,
        licenseExpiry,
        insuranceNumber,
        insuranceExpiry,
      });

      Alert.alert("Success", "Documents updated successfully");
      onClose();
    } catch {
      Alert.alert("Error", "Failed to update documents");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Driver License Number</Text>
        <TextInput
          style={styles.input}
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="Enter license number"
          editable={!isSaving}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>License Expiry Date</Text>
        <TextInput
          style={styles.input}
          value={licenseExpiry}
          onChangeText={setLicenseExpiry}
          placeholder="DD/MM/YYYY"
          editable={!isSaving}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Insurance Policy Number</Text>
        <TextInput
          style={styles.input}
          value={insuranceNumber}
          onChangeText={setInsuranceNumber}
          placeholder="Enter insurance policy number"
          editable={!isSaving}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Insurance Expiry Date</Text>
        <TextInput
          style={styles.input}
          value={insuranceExpiry}
          onChangeText={setInsuranceExpiry}
          placeholder="DD/MM/YYYY"
          editable={!isSaving}
        />
      </View>
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSaveDocuments}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Documents</Text>
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

export default DocumentsForm;
