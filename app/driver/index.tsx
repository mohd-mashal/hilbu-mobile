import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Car, MapPin as MapPinIcon, User as UserIcon, Clock as ClockIcon, ArrowUpDown as ArrowUpDownIcon, CircleCheck as CheckCircleIcon, Circle as XCircleIcon } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDriver } from '@/hooks/useDriver';

type RecoveryRequest = {
  id: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  timestamp: string;
  vehicle: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
};

export default function DriverHomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [activeRequests, setActiveRequests] = useState<RecoveryRequest[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<RecoveryRequest | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const mapRef = useRef<MapView>(null);
  const { getRecoveryRequests, acceptRequest, rejectRequest } = useDriver();
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for this app.');
        return;
      }
      
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Load requests
      loadRecoveryRequests();
    })();
    
    // Poll for new requests every 20 seconds
    const interval = setInterval(() => {
      if (isOnline && !acceptedRequest) {
        loadRecoveryRequests();
      }
    }, 20000);
    
    return () => clearInterval(interval);
  }, [isOnline, acceptedRequest]);
  
  const loadRecoveryRequests = async () => {
    try {
      const requests = await getRecoveryRequests();
      setActiveRequests(requests);
    } catch (error) {
      console.error("Error loading recovery requests:", error);
    }
  };
  
  const handleAcceptRequest = async (request: RecoveryRequest) => {
    try {
      await acceptRequest(request.id);
      setAcceptedRequest(request);
      
      Alert.alert(
        'Request Accepted',
        'You have accepted this recovery request. Navigate to the pickup location.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to accept request. Please try again.');
    }
  };
  
  const handleRejectRequest = async (request: RecoveryRequest) => {
    try {
      await rejectRequest(request.id);
      setActiveRequests(activeRequests.filter(r => r.id !== request.id));
    } catch (error) {
      Alert.alert('Error', 'Failed to reject request. Please try again.');
    }
  };
  
  const toggleOnlineStatus = () => {
    if (acceptedRequest) {
      Alert.alert(
        'Active Job',
        'You have an active recovery job. Please complete it before going offline.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsOnline(!isOnline);
    
    if (!isOnline) {
      loadRecoveryRequests();
    }
  };
  
  const handleCompleteJob = () => {
    if (!acceptedRequest) return;
    
    Alert.alert(
      'Complete Job',
      'Have you completed this recovery job?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            // In a real app, update the job status in the backend
            setAcceptedRequest(null);
            loadRecoveryRequests();
          }
        }
      ]
    );
  };
  
  const renderRequestItem = ({ item }: { item: RecoveryRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <View style={styles.customerInfo}>
          <UserIcon color="#000000" size={18} />
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <View style={styles.timestampContainer}>
          <ClockIcon color="#555555" size={14} />
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <MapPinIcon color="#000000" size={18} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickup}
          </Text>
        </View>
        
        <ArrowUpDownIcon color="#555555" size={14} style={styles.arrowIcon} />
        
        <View style={styles.locationItem}>
          <MapPinIcon color="#000000" size={18} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.dropoff || 'Not specified'}
          </Text>
        </View>
      </View>
      
      {item.vehicle && (
        <View style={styles.vehicleContainer}>
          <Car color="#000000" size={18} />
          <Text style={styles.vehicleText}>{item.vehicle}</Text>
        </View>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.rejectButton}
          onPress={() => handleRejectRequest(item)}
        >
          <XCircleIcon color="#FF3B30" size={20} />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item)}
        >
          <CheckCircleIcon color="#000000" size={20} />
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
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
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Driver Marker */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
            
            {/* Request Markers */}
            {activeRequests.map((request) => (
              <Marker
                key={request.id}
                coordinate={{
                  // In a real app, these would be actual coordinates
                  latitude: location.coords.latitude + (Math.random() - 0.5) * 0.02,
                  longitude: location.coords.longitude + (Math.random() - 0.5) * 0.02,
                }}
                title={request.customerName}
                description={request.pickup}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: {isOnline ? 'Online' : 'Offline'}
        </Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isOnline ? styles.onlineButton : styles.offlineButton
          ]}
          onPress={toggleOnlineStatus}
        >
          <Text style={styles.statusButtonText}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {acceptedRequest ? (
        <View style={styles.activeJobContainer}>
          <View style={styles.activeJobHeader}>
            <Text style={styles.activeJobTitle}>Active Recovery Job</Text>
          </View>
          
          <View style={styles.activeJobContent}>
            <View style={styles.customerInfo}>
              <UserIcon color="#000000" size={18} />
              <Text style={styles.customerName}>{acceptedRequest.customerName}</Text>
            </View>
            
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <MapPinIcon color="#000000" size={18} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {acceptedRequest.pickup}
                </Text>
              </View>
              
              <ArrowUpDownIcon color="#555555" size={14} style={styles.arrowIcon} />
              
              <View style={styles.locationItem}>
                <MapPinIcon color="#000000" size={18} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {acceptedRequest.dropoff || 'Not specified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.activeJobActions}>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => {/* Open directions */}}
              >
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteJob}
              >
                <Text style={styles.completeButtonText}>Complete Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.requestsContainer}>
          <Text style={styles.requestsTitle}>
            {isOnline ? 'Available Requests' : 'Go online to see requests'}
          </Text>
          
          {isOnline && (
            <FlatList
              data={activeRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.requestsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No active requests at the moment</Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    height: '40%',
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
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  onlineButton: {
    backgroundColor: '#FF3B30',
  },
  offlineButton: {
    backgroundColor: '#34C759',
  },
  statusButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  requestsContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  requestsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
    padding: 16,
  },
  requestsList: {
    padding: 16,
    paddingTop: 0,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginTop: 20,
  },
  requestItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#555555',
    marginLeft: 4,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  arrowIcon: {
    alignSelf: 'center',
    marginVertical: 4,
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  vehicleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  rejectButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFDC00',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  acceptButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  activeJobContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  activeJobHeader: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeJobTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  activeJobContent: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeJobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  directionsButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    marginRight: 8,
  },
  directionsButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFDC00',
    borderRadius: 8,
    marginLeft: 8,
  },
  completeButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#000000',
  },
});