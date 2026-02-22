import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aibltycode.app',
  appName: 'AIblty',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    allowMixedContent: false
  },
  ios: {
    contentInset: 'automatic'
  },
  server: {
    url: "https://b0eb3ecf-036d-4ec9-a3b5-c5b82e54db6a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
