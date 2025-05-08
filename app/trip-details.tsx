import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft as ArrowLeftIcon, MapPin as MapPinIcon, Clock as ClockIcon, Truck as TruckIcon, CreditCard as CreditCardIcon, CircleCheck as CheckCircleIcon } from 'lucide-react-native';
import { useRecoveryRequest } from '@/hooks/useRecoveryRequest';

type TripDetail = {
  id: string;
  customerName: string;
  driverName: string;
  pickup: string;
  dropoff: string;
  timestamp: string;
  completedAt: string;
  status: string;
  amount: string;
  paymentMethod: string;
  vehicle: string;
};

export default function TripDetailsScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const [tripDetail, setTripDetail] = useState<TripDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getTripDetails } = useRecoveryRequest();
  
  useEffect(() => {
    loadTripDetail();
  }, [id]);
  
  const loadTripDetail = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      const detail = await getTripDetails(id as string);
      setTripDetail(detail);
    } catch (error) {
      console.error("Error loading trip detail:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      case 'pending':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };
  
  if (isLoading || !tripDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>
              {formatDate(tripDetail.timestamp)}
            </Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(tripDetail.status) + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(tripDetail.status) }
              ]}>
                {tripDetail.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <View style={styles.iconWrapper}>
                <MapPinIcon color="#000000" size={20} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationText}>{tripDetail.pickup}</Text>
              </View>
            </View>
            
            <View style={styles.locationItem}>
              <View style={styles.iconWrapper}>
                <TruckIcon color="#000000" size={20} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Dropoff</Text>
                <Text style={styles.locationText}>{tripDetail.dropoff}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <ClockIcon color="#555555" size={20} />
            <Text style={styles.detailLabel}>Completed</Text>
            <Text style={styles.detailValue}>
              {formatDate(tripDetail.completedAt)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <TruckIcon color="#555555" size={20} />
            <Text style={styles.detailLabel}>Vehicle</Text>
            <Text style={styles.detailValue}>{tripDetail.vehicle}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <CheckCircleIcon color="#555555" size={20} />
            <Text style={styles.detailLabel}>Driver</Text>
            <Text style={styles.detailValue}>{tripDetail.driverName}</Text>
          </View>
        </View>
        
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment</Text>
          
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Recovery Fee</Text>
            <Text style={styles.paymentValue}>KD 15.00</Text>
          </View>
          
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Service Fee</Text>
            <Text style={styles.paymentValue}>KD 2.50</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{tripDetail.amount}</Text>
          </View>
          
          <View style={styles.paymentMethod}>
            <CreditCardIcon color="#000000" size={20} />
            <Text style={styles.paymentMethodText}>
              {tripDetail.paymentMethod}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Get Invoice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 16,
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconWrapper: {
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
  locationLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
  },
  paymentCard: {
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
  paymentTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
  },
  paymentValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FFDC00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
  helpButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  helpButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555555',
  },
});