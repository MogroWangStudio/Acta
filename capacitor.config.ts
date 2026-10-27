import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mws.acta',
  appName: 'Acta',
  webDir: 'dist',
  android: {
    backgroundColor: '#e7e7e3',
    allowMixedContent: false,
    captureInput: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_acta',
      iconColor: '#526b55',
    },
  },
};

export default config;
