import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b0eb3ecf036d4ec9a3b5c5b82e54db6a',
  appName: 'aibltycode',
  webDir: 'dist',
  server: {
    url: 'https://b0eb3ecf-036d-4ec9-a3b5-c5b82e54db6a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false
    }
  }
};

export default config;