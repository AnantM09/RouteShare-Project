// app.config.ts
// [Purpose] Expo configuration and environment-variable wiring for RouteShare.

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return {
    ...config,
    name: 'RouteShare',
    slug: 'RouteShare',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'routeshare',

    ios: {
      supportsTablet: true,
    },
    plugins: [['expo-location', { locationWhenInUsePermission: 'Allow RouteShare to record your drive while the app is open.' }]],

    // [Block] Supply the Google Maps key to the native Android map provider.
    android: {
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },

    // [Block] Expose public runtime configuration used by the existing Maps and Supabase helpers.
    extra: {
      googleMapsApiKey,
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
  };
};
