// app/index.tsx — Expo Router entry
// AIBLTY Code
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuth ? '/(tabs)/' : '/(auth)/login'} />;
}
