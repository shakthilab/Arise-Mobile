import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';

export default function AchievementsScreen() {
  return (
    <Screen style={styles.container}>
      {/* Top Header Title */}
      <Text style={styles.headerTitle}>Metrics</Text>

      {/* Centered Empty State */}
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Metrics is empty</Text>
        <Text style={styles.emptySubtitle}>Complete missions to track your metrics.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
  },
});
