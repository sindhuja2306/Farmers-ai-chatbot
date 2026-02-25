import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ userName, userPhone, onSaveProfile, onLogout, onOpenUpload }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#166534',
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarStyle: { borderTopColor: '#BBF7D0', borderTopWidth: 1, backgroundColor: '#FFFFFF' },
        tabBarIcon: ({ color }) => {
          const icon = route.name === 'Home' ? '🏠' : route.name === 'Chat' ? '🤖' : '👨‍🌾';
          return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            userName={userName}
            onOpenProfile={() => navigation.navigate('Profile')}
            onOpenChat={() => navigation.navigate('Chat')}
            onOpenUpload={onOpenUpload}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            userPhone={userPhone}
            userName={userName}
            onSaveProfile={onSaveProfile}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('9876543210');
  const [userName, setUserName] = useState('Farmer');

  const handleLogin = (/** @type {import("react").SetStateAction<string>} */ phone, /** @type {any} */ name) => {
    setUserPhone(phone);
    setUserName(name || 'Farmer');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSaveProfile = ({ name, phone }) => {
    setUserName(name || 'Farmer');
    setUserPhone(phone || '');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="MainTabs">
              {({ navigation }) => (
                <MainTabs
                  userName={userName}
                  userPhone={userPhone}
                  onSaveProfile={handleSaveProfile}
                  onLogout={handleLogout}
                  onOpenUpload={() => navigation.navigate('Upload')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Upload"
              component={UploadScreen}
              options={{ headerShown: true, title: 'Upload' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
