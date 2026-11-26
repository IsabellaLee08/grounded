import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StoreProvider, useStore } from './src/store';
import { colors } from './src/theme';
import { EventDetail } from './src/components/EventDetail';
import { Survey } from './src/components/Survey';
import EventsScreen from './src/screens/EventsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ForYouScreen from './src/screens/ForYouScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import MoreScreen from './src/screens/MoreScreen';
import AuthScreen from './src/screens/AuthScreen';

const Tab = createBottomTabNavigator();
const icons: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Events: ['albums', 'albums-outline'],
  Calendar: ['calendar', 'calendar-outline'],
  'For You': ['sparkles', 'sparkles-outline'],
  Discover: ['compass', 'compass-outline'],
  You: ['person', 'person-outline'],
};

function Shell() {
  const { authReady, session, ready, profile } = useStore();
  const [showSurvey, setShowSurvey] = useState(false);
  useEffect(() => { if (ready && !profile.onboarded) setShowSurvey(true); }, [ready]);
  if (!authReady) return null;
  if (!session) return <AuthScreen />;
  if (!ready) return null;
  return (
    <>
      <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.navy,
            tabBarInactiveTintColor: colors.muted,
            tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.outline },
            tabBarLabelStyle: { fontWeight: '700', fontSize: 10 },
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size} color={color} />
            ),
          })}
        >
          <Tab.Screen name="Events" component={EventsScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="For You" component={ForYouScreen} />
          <Tab.Screen name="Discover" component={DiscoverScreen} />
          <Tab.Screen name="You" component={MoreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <EventDetail />
      <Survey visible={showSurvey} onClose={() => setShowSurvey(false)} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Shell />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
