import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function OTPScreen() {
  const params = useLocalSearchParams();
  const { phoneNumber, isGuest } = params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { verifyOtp } = useAuth();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendActive(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(0);
    }
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Move to next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all filled
    if (text !== '' && index === 5) {
      handleVerifyOtp();
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length === 6) {
      // In a real app, verify OTP with Firebase or backend
      const success = verifyOtp(phoneNumber as string, otpValue);
      
      if (success) {
        if (isGuest === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/register');
        }
      } else {
        Alert.alert('Error', 'Invalid OTP code. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter complete OTP code.');
    }
  };
  
  const handleResendOtp = () => {
    // In a real app, call API to resend OTP
    setTimer(60);
    setIsResendActive(false);
    Alert.alert('Success', 'OTP has been resent to your phone number.');
  };
  
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
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We have sent a verification code to {phoneNumber}
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {isResendActive ? (
              'Didn\'t receive the code?'
            ) : (
              `Resend code in ${timer} seconds`
            )}
          </Text>
          
          {isResendActive && (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendButton}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.button,
            otp.some(digit => digit === '') && styles.buttonDisabled
          ]}
          onPress={handleVerifyOtp}
          disabled={otp.some(digit => digit === '')}
        >
          <Text style={styles.buttonText}>Verify & Proceed</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
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
    paddingHorizontal: 24,
    paddingTop: 40,
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
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
  },
  resendButton: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  button: {
    backgroundColor: '#FFDC00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
});