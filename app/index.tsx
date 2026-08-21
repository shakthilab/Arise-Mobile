import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';

export default function Index() {
  const { isAuthenticated, isOnboarded, isBootstrapping } = useAuth();

  // Wait for restoreSession() (app/_layout.tsx) to finish reading the
  // persisted token before deciding where to route — otherwise this always
  // sees the initial user:null on a fresh page load and redirects to login
  // even when a valid session is still stored.
  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accentGold} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(onboarding)/name" />;
  }

  return <Redirect href="/(tabs)" />;
}
