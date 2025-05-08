import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { User as UserIcon, Bell as BellIcon, Globe as GlobeIcon, Languages as LanguageIcon, CreditCard as CreditCardIcon, Shield as ShieldIcon, LogOut as LogOutIcon } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ name: string; email: string; phone: string; } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const { getUserInfo, logout } = useAuth();
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const userData = await getUserInfo();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };
  
  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        {
          text: 'English',
          onPress: () => setLanguage('English'),
        },
        {
          text: 'Arabic',
          onPress: () => setLanguage('Arabic'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <UserIcon color="#FFFFFF" size={32} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileContact}>{user?.phone || 'No phone number'}</Text>
            <Text style={styles.profileContact}>{user?.email || 'No email address'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Settings</Text>
        </View>
        
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <BellIcon color="#000000" size={20} />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              trackColor={{ false: '#E5E5E5', true: '#FFDC00' }}
              thumbColor="#FFFFFF"
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingIconContainer}>
              <GlobeIcon color="#000000" size={20} />
            </View>
            <Text style={styles.settingText}>Language</Text>
            <View style={styles.settingAction}>
              <Text style={styles.settingActionText}>{language}</Text>
              <LanguageIcon color="#888888" size={16} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/payment-methods')}>
            <View style={styles.settingIconContainer}>
              <CreditCardIcon color="#000000" size={20} />
            </View>
            <Text style={styles.settingText}>Payment Methods</Text>
            <View style={styles.settingAction}>
              <LanguageIcon color="#888888" size={16} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/privacy-policy')}>
            <View style={styles.settingIconContainer}>
              <ShieldIcon color="#000000" size={20} />
            </View>
            <Text style={styles.settingText}>Privacy & Terms</Text>
            <View style={styles.settingAction}>
              <LanguageIcon color="#888888" size={16} />
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOutIcon color="#FF3B30" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  profileContact: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionTitleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#000000',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingActionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#888888',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
  },
});