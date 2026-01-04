import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function BarcodeScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);

  if (!permission) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera permission is required to scan barcodes
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const result = {
      type,
      data,
      timestamp: new Date().toLocaleString()
    };
    setScanResult(result);
    
    // Add to history
    setHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Barcode data copied to clipboard');
  };

  const scanAgain = () => {
    setScanned(false);
    setScanResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Scan Delivery QR</Text>
        <Text style={styles.headerSubtitle}>
          Scan QR codes, barcodes, and more for quick delivery lookup.
        </Text>
      </View>

      {/* Camera View */}
      {!scanned ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr',
                'ean13',
                'ean8',
                'upc_a',
                'upc_e',
                'code39',
                'code93',
                'code128',
                'codabar',
                'itf14',
                'pdf417',
                'aztec',
                'datamatrix'
              ],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanBox}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.scanText}>
                Position barcode within the frame
              </Text>
            </View>
          </CameraView>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.successTitle}>✓ Scan Successful!</Text>
            
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultData}>{scanResult?.data}</Text>
            </View>

            <Text style={styles.resultInfo}>
              Type: {scanResult?.type} • {scanResult?.timestamp}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.copyButton]}
                onPress={() => copyToClipboard(scanResult?.data)}
              >
                <Text style={styles.buttonText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.scanButton]}
                onPress={scanAgain}
              >
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Scans</Text>
          {history.slice(0, 3).map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.historyItem}
              onPress={() => copyToClipboard(item.data)}
            >
              <Text style={styles.historyData} numberOfLines={1}>
                {item.data}
              </Text>
              <Text style={styles.historyInfo}>
                {item.type} • {item.timestamp}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#64748b',
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#3b82f6',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    marginTop: 40,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  resultData: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1e293b',
  },
  resultInfo: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#3b82f6',
  },
  scanButton: {
    backgroundColor: '#6366f1',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyData: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1e293b',
    marginBottom: 4,
  },
  historyInfo: {
    fontSize: 11,
    color: '#64748b',
  },
});