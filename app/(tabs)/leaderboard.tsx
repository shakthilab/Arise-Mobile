import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';

export default function LeaderboardScreen() {
  return (
    <Screen style={styles.container}>
      <LinearGradient
        colors={['#0D0D11', '#070709', '#030304']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.headerBar}>
        <Text style={styles.title}>HUNTER ARENA</Text>
        <Text style={styles.subtitle}>GLOBAL LEADERBOARD</Text>
      </View>

      <View style={styles.emptyContent}>
        <Text style={styles.emptyText}>Leaderboard Coming Soon</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#71717A',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fontFamilies.medium,
    color: '#71717A',
    fontSize: 14,
  },
});
