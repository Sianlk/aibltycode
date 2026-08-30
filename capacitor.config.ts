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
  // server.url is intentionally left empty for release builds so the app serves
  // bundled local assets. Enable live-reload only during local development via
  // `npx cap run android --live-reload`.
};

export default config;
