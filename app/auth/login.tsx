import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Phone as PhoneIcon, ArrowRight as ArrowRightIcon } from 'lucide-react-native';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  
  const handleSendOTP = () => {
    // In a real app, we would validate the phone number here
    if (phoneNumber.length >= 8) {
      router.push({
        pathname: '/auth/otp',
        params: { phoneNumber, isGuest: isGuest ? 'true' : 'false' }
      });
    }
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    // Redirect directly to main app as guest
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome to HILBU</Text>
        <Text style={styles.subtitle}>Your trusted car recovery service</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.phoneInputContainer}>
            <View style={styles.phoneIconContainer}>
              <PhoneIcon color="#000000" size={20} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#888888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              !phoneNumber ? styles.buttonDisabled : null
            ]} 
            onPress={handleSendOTP}
            disabled={!phoneNumber}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRightIcon color="#000000" size={20} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.guestButton} 
          onPress={handleContinueAsGuest}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555555',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    overflow: 'hidden',
  },
  phoneIconContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000000',
    padding: 16,
  },
  button: {
    backgroundColor: '#FFDC00',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  guestButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#555555',
  },
});