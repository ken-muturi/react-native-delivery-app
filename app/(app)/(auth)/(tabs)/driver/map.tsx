import { Colors } from '@/constants/theme';
import useOrderStore from '@/hooks/use-orderstore';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { AppleMapsMapType } from 'expo-maps/build/apple/AppleMaps.types';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Nairobi delivery locations for demo
const deliveryCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'Westlands, Sarit Centre, Nairobi': { latitude: -1.2635, longitude: 36.8030 },
  'Kilimani, Yaya Centre, Nairobi': { latitude: -1.2921, longitude: 36.7876 },
  'Parklands, 3rd Avenue, Nairobi': { latitude: -1.2589, longitude: 36.8178 },
  'Lavington, James Gichuru Road, Nairobi': { latitude: -1.2780, longitude: 36.7680 },
  'Karen, Hardy, Nairobi': { latitude: -1.3180, longitude: 36.7120 },
  'Upperhill, Ralph Bunche Road, Nairobi': { latitude: -1.2950, longitude: 36.8150 },
  'South B, Mombasa Road, Nairobi': { latitude: -1.3100, longitude: 36.8350 },
};

const DriverMapScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<AppleMaps.MapView | GoogleMaps.MapView>(null);
  const { orders } = useOrderStore();
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Get active orders (collected or in-transit)
  const activeOrders = orders.filter(
    (order) => order.status === 'collected' || order.status === 'in-transit'
  );

  // Create markers for active deliveries
  const deliveryMarkers: AppleMaps.Marker[] = activeOrders
    .map((order) => {
      const coords = deliveryCoordinates[order.deliveryAddress];
      if (!coords) return null;
      return {
        id: order.id,
        systemImage: order.status === 'in-transit' ? 'car.fill' : 'shippingbox.fill',
        tintColor: order.status === 'in-transit' ? '#5856D6' : '#007AFF',
        coordinates: coords,
        title: order.customerName,
      };
    })
    .filter(Boolean) as AppleMaps.Marker[];

  // Add driver location marker
  const allMarkers: AppleMaps.Marker[] = driverLocation
    ? [
        {
          id: 'driver',
          systemImage: 'bicycle.circle.fill',
          tintColor: Colors.primary,
          coordinates: driverLocation,
          title: 'You',
        },
        ...deliveryMarkers,
      ]
    : deliveryMarkers;

  const locateMe = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setDriverLocation(coords);
      mapRef.current?.setCameraPosition({
        coordinates: coords,
        zoom: 14,
      });
    } catch (error) {
      console.error('Failed to get location:', error);
      // Default to Nairobi CBD if location fails
      const defaultCoords = { latitude: -1.2864, longitude: 36.8172 };
      setDriverLocation(defaultCoords);
      mapRef.current?.setCameraPosition({
        coordinates: defaultCoords,
        zoom: 14,
      });
    }
  };

  useEffect(() => {
    async function initLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        setLoading(false);
        return;
      }
      await locateMe();
      setLoading(false);
    }
    initLocation();
  }, []);

  // Watch location updates
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function watchLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    }
    watchLocation();

    return () => {
      subscription?.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.muted} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Location</Text>
          <TouchableOpacity style={styles.backButton} onPress={locateMe}>
            <Ionicons name="locate-outline" size={22} />
          </TouchableOpacity>
        </View>

        <AppleMaps.View
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          markers={allMarkers}
          cameraPosition={{
            coordinates: driverLocation || { latitude: -1.2864, longitude: 36.8172 },
            zoom: 14,
          }}
          properties={{
            isTrafficEnabled: true,
            mapType: AppleMapsMapType.STANDARD,
            selectionEnabled: true,
            isMyLocationEnabled: true,
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            compassEnabled: true,
          }}
        />

        {/* Active deliveries panel */}
        <View style={styles.deliveriesPanel}>
          <Text style={styles.panelTitle}>
            Active Deliveries ({activeOrders.length})
          </Text>
          {activeOrders.length === 0 ? (
            <Text style={styles.noDeliveries}>No active deliveries</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeOrders.map((order) => (
                <View
                  key={order.id}
                  style={[
                    styles.deliveryCard,
                    {
                      borderLeftColor:
                        order.status === 'in-transit' ? '#5856D6' : '#007AFF',
                    },
                  ]}>
                  <Text style={styles.cardCustomer}>{order.customerName}</Text>
                  <Text style={styles.cardAddress} numberOfLines={1}>
                    {order.deliveryAddress}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            order.status === 'in-transit' ? '#5856D6' : '#007AFF',
                        },
                      ]}>
                      <Text style={styles.statusText}>
                        {order.status === 'in-transit' ? 'In Transit' : 'Collected'}
                      </Text>
                    </View>
                    <Text style={styles.cardTotal}>
                      KES {order.total.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Driver status indicator */}
        {driverLocation && (
          <View style={[styles.locationBadge, { top: insets.top + 60 }]}>
            <Ionicons name="navigate" size={14} color="#fff" />
            <Text style={styles.locationText}>
              {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </>
    );
  } else if (Platform.OS === 'android') {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only supported on Android and iOS!</Text>;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.muted,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveriesPanel: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 12,
  },
  noDeliveries: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  deliveryCard: {
    width: 200,
    backgroundColor: Colors.light,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderLeftWidth: 4,
  },
  cardCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  cardTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  locationBadge: {
    position: 'absolute',
    left: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
});

export default DriverMapScreen;
