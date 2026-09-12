import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

import { useMetricsStore } from '@/store/useMetricsStore';
import { ConnectHealthView } from '@/components/features/fitness/ConnectHealthView';
import { MetricsDashboardView } from '@/components/features/fitness/MetricsDashboardView';

export default function MetricsScreen() {
  const router = useRouter();
  const { isHealthConnected, isLoaded, initFromStorage } = useMetricsStore(
    useShallow((state) => ({
      isHealthConnected: state.isHealthConnected,
      isLoaded: state.isLoaded,
      initFromStorage: state.initFromStorage,
    }))
  );

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.loadingCenter]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color="#FE5B01" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {isHealthConnected ? (
        <MetricsDashboardView onBack={handleBack} showBackButton={true} />
      ) : (
        <ConnectHealthView onBack={handleBack} showBackButton={true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050608',
  },
  loadingCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
