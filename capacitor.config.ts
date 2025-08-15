import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spacemate.app',
  appName: 'Space Mate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: '#ffffff'
  },
  ios: {
    allowsLinkPreview: true,
    scrollEnabled: true,
    contentInset: 'automatic',
    allowsBackForwardNavigationGestures: true,
    backgroundColor: '#ffffff'
  },
  plugins: {
    Keyboard: {
      resize: true,
      style: 'DARK',
      resizeOnFullScreen: true,
      keyboardAppearance: 'light',
      clearInputs: false,
      scrollAssist: false,
      hideKeyboardAccessoryBar: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
