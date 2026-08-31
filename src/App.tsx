/**
 * AIBLTY Code — Root App Component
 */
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator, {linking} from './navigation/AppNavigator';
import {useAuthStore} from './store/authStore';
import {initDeepLinks} from './utils/deepLinks';
import {initPushNotifications} from './utils/pushNotifications';
import Analytics from './services/analytics';

const navigationRef = React.createRef<any>();

export default function App() {
  const {accessToken, bootstrapAuth} = useAuthStore();

  useEffect(() => {
    bootstrapAuth();
    Analytics.appOpened(Boolean(accessToken));
  }, []);

  useEffect(() => {
    const cleanup = initDeepLinks(navigationRef);
    return cleanup;
  }, []);

  useEffect(() => {
    if (accessToken) {
      initPushNotifications({
        apiBaseUrl: 'https://api.aiblty-code.sianlk.com',
        accessToken,
      });
    }
  }, [accessToken]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#6366F1"
        />
        <NavigationContainer ref={navigationRef} linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
