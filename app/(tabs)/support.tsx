import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle as MessageCircleIcon, PhoneCall as PhoneCallIcon, Send as SendIcon } from 'lucide-react-native';

export default function SupportScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; timestamp: Date }[]>([
    {
      text: 'Hello! How can we help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMessages = [
      ...messages,
      {
        text: message,
        isUser: true,
        timestamp: new Date(),
      }
    ];
    setMessages(newMessages);
    setMessage('');
    
    // Simulate response after 1 second
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          text: 'Thanks for reaching out. Our support team will get back to you shortly. For urgent matters, please call our hotline.',
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    }, 1000);
  };
  
  const callSupport = () => {
    Linking.openURL('tel:+1234567890');
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support</Text>
      </View>
      
      <View style={styles.supportOptionContainer}>
        <TouchableOpacity style={styles.supportOption} onPress={callSupport}>
          <View style={styles.supportIconContainer}>
            <PhoneCallIcon color="#FFFFFF" size={24} />
          </View>
          <View style={styles.supportTextContainer}>
            <Text style={styles.supportTitle}>Call Support</Text>
            <Text style={styles.supportDescription}>
              24/7 emergency support line
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.supportOption}>
          <View style={[styles.supportIconContainer, styles.chatIconContainer]}>
            <MessageCircleIcon color="#FFFFFF" size={24} />
          </View>
          <View style={styles.supportTextContainer}>
            <Text style={styles.supportTitle}>Chat Support</Text>
            <Text style={styles.supportDescription}>
              Message our support team
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chatContainer}>
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          inverted
        >
          {[...messages].reverse().map((msg, index) => (
            <View 
              key={index}
              style={[
                styles.messageBubble,
                msg.isUser ? styles.userMessage : styles.supportMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here..."
            placeholderTextColor="#888888"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <SendIcon color={message.trim() ? '#000000' : '#888888'} size={20} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000000',
  },
  supportOptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chatIconContainer: {
    backgroundColor: '#FFDC00',
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  supportDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#555555',
  },
  chatContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFDC00',
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000000',
  },
  messageTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFDC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
});