import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft as ArrowLeftIcon, Plus as PlusIcon, CreditCard as CreditCardIcon, Trash as TrashIcon } from 'lucide-react-native';

type PaymentMethod = {
  id: string;
  type: 'card' | 'knet';
  name: string;
  number: string; // Last 4 digits for cards
  expiryDate?: string;
  isDefault: boolean;
};

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Credit Card',
      number: '4242',
      expiryDate: '05/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'knet',
      name: 'KNET',
      number: '9876',
      isDefault: false,
    }
  ]);
  
  const handleAddPayment = () => {
    // In a real app, navigate to add payment method screen
    router.push('/add-payment');
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  const handleRemove = (id: string) => {
    setPaymentMethods(methods => 
      methods.filter(method => method.id !== id)
    );
  };
  
  const renderPaymentMethod = (method: PaymentMethod) => (
    <View 
      key={method.id}
      style={[
        styles.paymentCard,
        method.isDefault && styles.defaultPaymentCard
      ]}
    >
      <View style={styles.paymentCardContent}>
        <View style={styles.paymentIconContainer}>
          <CreditCardIcon 
            color={method.type === 'card' ? '#000000' : '#005EB8'} 
            size={24} 
          />
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentName}>{method.name}</Text>
          <Text style={styles.paymentNumber}>
            {method.type === 'card' ? `**** **** **** ${method.number}` : `KNET ${method.number}`}
          </Text>
          {method.expiryDate && (
            <Text style={styles.expiryDate}>Exp: {method.expiryDate}</Text>
          )}
        </View>
        
        <View style={styles.paymentActions}>
          {method.isDefault ? (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.defaultButton}
              onPress={() => handleSetDefault(method.id)}
            >
              <Text style={styles.defaultButtonText}>Set Default</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemove(method.id)}
          >
            <TrashIcon color="#FF3B30" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Manage your payment methods for HILBU services
        </Text>
        
        {paymentMethods.map(renderPaymentMethod)}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPayment}
        >
          <PlusIcon color="#000000" size={20} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
        
        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            All payment information is securely stored and processed using industry-standard encryption.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginBottom: 24,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  defaultPaymentCard: {
    borderColor: '#FFDC00',
    borderWidth: 2,
  },
  paymentCardContent: {
    padding: 16,
  },
  paymentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentInfo: {
    marginBottom: 16,
  },
  paymentName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  paymentNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  expiryDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#FFDC00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  defaultText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#000000',
  },
  defaultButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
  },
  defaultButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#555555',
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDC00',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  addButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  securityNote: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  securityNoteText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
});