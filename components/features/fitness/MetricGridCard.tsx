import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fontFamilies } from '@/theme/typography';

export type MetricCardType =
  | 'calories'
  | 'distance'
  | 'activeMinutes'
  | 'heartRate'
  | 'sleep'
  | 'workouts';

interface MetricGridCardProps {
  type: MetricCardType;
  title: string;
  value: string;
  unit?: string;
  trend: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

const ICON_CONFIG: Record<
  MetricCardType,
  {
    family: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
    name: string;
    color: string;
  }
> = {
  calories: {
    family: 'MaterialCommunityIcons',
    name: 'fire',
    color: '#FF6B00',
  },
  distance: {
    family: 'Ionicons',
    name: 'location-sharp',
    color: '#FF4158',
  },
  activeMinutes: {
    family: 'Ionicons',
    name: 'flash',
    color: '#FFB800',
  },
  heartRate: {
    family: 'Ionicons',
    name: 'heart',
    color: '#FF334B',
  },
  sleep: {
    family: 'Ionicons',
    name: 'moon',
    color: '#4B7BFF',
  },
  workouts: {
    family: 'MaterialCommunityIcons',
    name: 'dumbbell',
    color: '#B55FE6',
  },
};

export function MetricGridCard({
  type,
  title,
  value,
  unit,
  trend,
  trendDirection = 'up',
}: MetricGridCardProps) {
  const iconInfo = ICON_CONFIG[type];

  const renderIcon = () => {
    if (iconInfo.family === 'MaterialCommunityIcons') {
      return (
        <MaterialCommunityIcons
          name={iconInfo.name as any}
          size={18}
          color={iconInfo.color}
          style={styles.icon}
        />
      );
    }
    if (iconInfo.family === 'FontAwesome5') {
      return (
        <FontAwesome5
          name={iconInfo.name as any}
          size={16}
          color={iconInfo.color}
          style={styles.icon}
        />
      );
    }
    return (
      <Ionicons
        name={iconInfo.name as any}
        size={18}
        color={iconInfo.color}
        style={styles.icon}
      />
    );
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return '#22C55E';
    if (trendDirection === 'down') return '#EF4444';
    return '#71717A';
  };

  const getTrendIcon = () => {
    if (trendDirection === 'up') return '↑ ';
    if (trendDirection === 'down') return '↓ ';
    return '— ';
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#17171C', '#101013']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Header Row: Icon + Title */}
        <View style={styles.headerRow}>
          {renderIcon()}
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {/* Value Row: Big number + unit */}
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>{value}</Text>
          {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        </View>

        {/* Trend Indicator */}
        <View style={styles.trendRow}>
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {getTrendIcon()}
            {trend}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#24242C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  titleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#9E9EA8',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  valueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginRight: 4,
  },
  unitText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11.5,
    letterSpacing: -0.1,
  },
});
