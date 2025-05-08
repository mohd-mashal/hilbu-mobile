import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin as MapPinIcon, Phone as PhoneIcon, MessageCircle as MessageIcon, Circle as XCircleIcon } from 'lucide-react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRecoveryRequest } from '@/hooks/useRecoveryRequest';

export default function RecoveryTrackingScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('15 min');
  const [driverInfo, setDriverInfo] = useState({
    name: 'John Driver',
    vehicle: 'Toyota Tundra - Recovery Truck',
    rating: 4.8,
    photo: null,
  });
  const mapRef = useRef<MapView>(null);
  const { getCurrentRequest, cancelRecoveryRequest } = useRecoveryRequest();
  
  useEffect(() => {
    // Get and simulate driver's movement
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      
      // Simulate driver location (slightly away from user)
      const driverLoc = {
        latitude: location.coords.latitude + 0.01,
        longitude: location.coords.longitude + 0.01,
      };
      setDriverLocation(driverLoc);
      
      // Simulate driver movement
      const interval = setInterval(() => {
        setDriverLocation(prev => {
          if (!prev) return null;
          
          // Move driver closer to user
          const newLat = prev.latitude - 0.0005;
          const newLng = prev.longitude - 0.0005;
          
          // Update estimated time
          const distanceRemaining = calculateDistance(
            newLat, newLng,
            location.coords.latitude, location.coords.longitude
          );
          
          const etaMinutes = Math.max(1, Math.round(distanceRemaining * 20));
          setEstimatedTime(`${etaMinutes} min`);
          
          return {
            latitude: newLat,
            longitude: newLng,
          };
        });
      }, 3000);
      
      return () => clearInterval(interval);
    })();
    
    // Load current request
    loadCurrentRequest();
  }, []);
  
  const loadCurrentRequest = async () => {
    try {
      const request = await getCurrentRequest();
      // Update UI with request info
    } catch (error) {
      console.error("Error loading current request:", error);
    }
  };
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };
  
  const handleCallDriver = () => {
    // In a real app, this would open the phone dialer
  };
  
  const handleMessageDriver = () => {
    // In a real app, this would open a chat screen
  };
  
  const handleCancelRecovery = () => {
    cancelRecoveryRequest();
    router.replace('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        {userLocation && driverLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* User Marker */}
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              title="Your Location"
            />
            
            {/* Driver Marker */}
            <Marker
              coordinate={driverLocation}
              title="Recovery Vehicle"
            />
            
            {/* Route Line */}
            <Polyline
              coordinates={[
                driverLocation,
                {
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }
              ]}
              strokeColor="#FFDC00"
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      </View>
      
      {/* Tracking Info Panel */}
      <View style={styles.trackingPanel}>
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>Driver arriving in {estimatedTime}</Text>
        </View>
        
        <View style={styles.driverInfoContainer}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar} />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverInfo.name}</Text>
              <Text style={styles.vehicleInfo}>{driverInfo.vehicle}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {driverInfo.rating}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.driverActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCallDriver}
            >
              <PhoneIcon color="#FFFFFF" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleMessageDriver}
            >
              <MessageIcon color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <View style={styles.iconContainer}>
              <MapPinIcon color="#000000" size={20} />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationTitle}>Your location</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                5th Avenue, New York, NY
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancelRecovery}
        >
          <XCircleIcon color="#FF3B30" size={20} />
          <Text style={styles.cancelText}>Cancel Recovery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555555',
  },
  trackingPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  etaContainer: {
    backgroundColor: '#FFDC00',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  etaText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
  driverInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
  },
  driverActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  locationContainer: {
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000000',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
  },
  cancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
});