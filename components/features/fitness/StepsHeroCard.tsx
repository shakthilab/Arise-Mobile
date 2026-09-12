import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fontFamilies } from '@/theme/typography';
import { CircularProgressRing } from './CircularProgressRing';

interface StepsHeroCardProps {
  currentSteps: number;
  targetSteps: number;
  percentage?: number;
}

export function StepsHeroCard({
  currentSteps,
  targetSteps,
  percentage = 70,
}: StepsHeroCardProps) {
  const calculatedPercent =
    targetSteps > 0 ? Math.min(Math.round((currentSteps / targetSteps) * 100), 100) : percentage;
  const progressRatio = Math.min(Math.max(calculatedPercent / 100, 0), 1);

  return (
    <View style={styles.card}>
      {/* Background card gradient */}
      <LinearGradient
        colors={['#17171C', '#101013']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.contentRow}>
          {/* Left Column: Steps information */}
          <View style={styles.leftCol}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="shoe-print" size={18} color="#FE5B01" style={styles.footprintIcon} />
              <Text style={styles.titleText}>Steps</Text>
            </View>

            <Text style={styles.stepCountText}>{currentSteps.toLocaleString()}</Text>

            {/* Horizontal Progress Bar */}
            <View style={styles.barContainer}>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={['#FF4D4D', '#FE5B01']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.barFill, { width: `${progressRatio * 100}%` }]}
                />
              </View>
            </View>

            <Text style={styles.targetText}>of {targetSteps.toLocaleString()}</Text>
          </View>

          {/* Right Column: Circular Progress Ring */}
          <View style={styles.rightCol}>
            <CircularProgressRing
              size={84}
              strokeWidth={9}
              progress={calculatedPercent}
              label={`${calculatedPercent}%`}
              gradientColors={['#FE5B01', '#FF385C']}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#26262E',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 14,
  },
  cardGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: 16,
  },
  rightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  footprintIcon: {
    marginRight: 7,
    transform: [{ rotate: '-45deg' }],
  },
  titleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#9E9EA8',
  },
  stepCountText: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  barContainer: {
    marginBottom: 6,
  },
  barTrack: {
    height: 5,
    backgroundColor: '#272730',
    borderRadius: 3,
    overflow: 'hidden',
    width: '90%',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  targetText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
  },
});
