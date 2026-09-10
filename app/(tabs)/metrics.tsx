import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import { useMetricsStore } from '@/store/useMetricsStore';
import { ConnectHealthView } from '@/components/features/fitness/ConnectHealthView';
import { MetricsDashboardView } from '@/components/features/fitness/MetricsDashboardView';

export default function MetricsScreen() {
  const { isHealthConnected, disconnectProvider } = useMetricsStore();

  const handleBackToConnect = () => {
    disconnectProvider();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {isHealthConnected ? (
        <MetricsDashboardView onBack={handleBackToConnect} showBackButton={true} />
      ) : (
        <ConnectHealthView showBackButton={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050608',
  },
});
