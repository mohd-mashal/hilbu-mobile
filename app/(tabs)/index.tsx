import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin as MapPinIcon, Car as CarIcon, ChevronDown as ChevronDownIcon, Send as SendIcon } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRecoveryRequest } from '@/hooks/useRecoveryRequest';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [showVehicleInput, setShowVehicleInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { createRecoveryRequest } = useRecoveryRequest();
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for this app.');
        return;
      }
      
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Reverse geocode to get the address
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        
        if (addresses.length > 0) {
          const address = addresses[0];
          const formattedAddress = [
            address.name,
            address.street,
            address.district,
            address.city,
          ].filter(Boolean).join(', ');
          
          setPickup(formattedAddress);
        }
      } catch (error) {
        console.error("Error getting address:", error);
      }
    })();
  }, []);
  
  const handleRequestRecovery = async () => {
    if (!pickup) {
      Alert.alert('Error', 'Please specify the pickup location.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would create a recovery request in the backend
      await createRecoveryRequest({
        pickup,
        dropoff: dropoff || 'Not specified',
        vehicleDetails: vehicleDetails || 'Not specified',
        timestamp: new Date().toISOString(),
        status: 'pending',
      });
      
      setIsLoading(false);
      setRecoveryRequested(true);
      
      // Simulate finding a driver after 3 seconds
      setTimeout(() => {
        router.push('/recovery-tracking');
      }, 3000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create recovery request. Please try again.');
    }
  };
  
  const toggleVehicleInput = () => {
    setShowVehicleInput(!showVehicleInput);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      </View>
      
      {/* Request Form */}
      <View style={styles.formContainer}>
        <ScrollView>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Recovery Service</Text>
            <Text style={styles.formSubtitle}>Request a car recovery now</Text>
          </View>
          
          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <MapPinIcon color="#000000" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Pickup Location"
                placeholderTextColor="#888888"
                value={pickup}
                onChangeText={setPickup}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <MapPinIcon color="#000000" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Dropoff Location (optional)"
                placeholderTextColor="#888888"
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>
            
            <TouchableOpacity style={styles.detailsToggle} onPress={toggleVehicleInput}>
              <CarIcon color="#000000" size={20} />
              <Text style={styles.detailsToggleText}>
                {showVehicleInput ? 'Hide vehicle details' : 'Add vehicle details'}
              </Text>
              <ChevronDownIcon 
                color="#000000" 
                size={20} 
                style={[
                  styles.chevronIcon,
                  showVehicleInput && styles.chevronIconUp
                ]} 
              />
            </TouchableOpacity>
            
            {showVehicleInput && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.vehicleInput}
                  placeholder="Vehicle make, model, color, etc."
                  placeholderTextColor="#888888"
                  multiline
                  numberOfLines={3}
                  value={vehicleDetails}
                  onChangeText={setVehicleDetails}
                />
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.requestButton,
              (isLoading || recoveryRequested) && styles.requestButtonDisabled
            ]}
            onPress={handleRequestRecovery}
            disabled={isLoading || recoveryRequested}
          >
            {isLoading ? (
              <Text style={styles.requestButtonText}>Please wait...</Text>
            ) : recoveryRequested ? (
              <Text style={styles.requestButtonText}>Finding driver...</Text>
            ) : (
              <>
                <Text style={styles.requestButtonText}>Request Recovery Now</Text>
                <SendIcon color="#000000" size={20} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    marginTop: -30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#000000',
  },
  formSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555555',
  },
  inputsContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 45,
    paddingRight: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  vehicleInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },
  chevronIconUp: {
    transform: [{ rotate: '180deg' }],
  },
  requestButton: {
    backgroundColor: '#FFDC00',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  requestButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
});