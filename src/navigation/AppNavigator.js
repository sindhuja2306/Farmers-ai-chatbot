import { SafeAreaView, StyleSheet, View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

// @ts-ignore
function BottomNav({ activeTab, onTabChange }) {
  return (
    <View style={styles.navContainer}>
      <Pressable style={styles.navItem} onPress={() => onTabChange('home')}>
        <Text style={[styles.navIcon, activeTab === 'home' ? styles.activeIcon : null]}>🏠</Text>
        <Text style={[styles.navText, activeTab === 'home' ? styles.activeText : null]}>Home</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => onTabChange('upload')}>
        <Text style={[styles.navIcon, activeTab === 'upload' ? styles.activeIcon : null]}>📷</Text>
        <Text style={[styles.navText, activeTab === 'upload' ? styles.activeText : null]}>Upload</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => onTabChange('chat')}>
        <Text style={[styles.navIcon, activeTab === 'chat' ? styles.activeIcon : null]}>🤖</Text>
        <Text style={[styles.navText, activeTab === 'chat' ? styles.activeText : null]}>Chat</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => onTabChange('profile')}>
        <Text style={[styles.navIcon, activeTab === 'profile' ? styles.activeIcon : null]}>👨‍🌾</Text>
        <Text style={[styles.navText, activeTab === 'profile' ? styles.activeText : null]}>Profile</Text>
      </Pressable>
    </View>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('9876543210');
  const [userName, setUserName] = useState('Farmer');
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = (/** @type {import("react").SetStateAction<string>} */ phone, /** @type {any} */ name) => {
    setUserPhone(phone);
    setUserName(name || 'Farmer');
    setIsAuthenticated(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {activeTab === 'home' ? (
          <HomeScreen
            userName={userName}
            onOpenProfile={() => setActiveTab('profile')}
          />
        ) : null}
        {activeTab === 'upload' ? <UploadScreen /> : null}
        {activeTab === 'chat' ? <ChatScreen /> : null}
        {activeTab === 'profile' ? (
          <ProfileScreen
            userPhone={userPhone}
            userName={userName}
            onBack={() => setActiveTab('home')}
            onLogout={handleLogout}
          />
        ) : null}
      </View>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  container: {
    flex: 1,
  },
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 20,
    color: '#166534',
  },
  navText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  activeIcon: {
    color: '#16A34A',
  },
  activeText: {
    color: '#16A34A',
    fontWeight: '700',
  },
});
