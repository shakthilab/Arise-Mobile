import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { fontFamilies } from '@/theme/typography';

export interface DayBarData {
  day: string;
  label: string;
  value: number; // 0 to 100 percentage
  isCurrent?: boolean;
}

interface WeeklyActivityChartProps {
  avgSteps: string;
  days?: DayBarData[];
}

const DEFAULT_DAYS = [
  { id: 'mon', label: 'Mon', value: 55, isCompleted: true },
  { id: 'tue', label: 'Tue', value: 88, isCompleted: true },
  { id: 'wed', label: 'Wed', value: 42, isCompleted: true },
  { id: 'thu', label: 'Thu', value: 92, isCompleted: true, isCurrent: true },
  { id: 'fri', label: 'Fri', value: 0, isCompleted: false },
  { id: 'sat', label: 'Sat', value: 35, isCompleted: false },
  { id: 'sun', label: 'Sun', value: 50, isCompleted: false },
];

export function WeeklyActivityChart({ avgSteps, days }: WeeklyActivityChartProps) {
  const chartDays = days && days.length === 7
    ? days.map((d, i) => ({
        id: d.day || `day_${i}`,
        label: d.label || d.day,
        value: d.value,
        isCompleted: i <= 3, // Mon-Thu completed
        isCurrent: d.isCurrent || i === 3,
      }))
    : DEFAULT_DAYS;

  const [selectedDay, setSelectedDay] = useState<string>('thu');
  const trackHeight = 68;

  const handleBarPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDay(id);
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#16171E', '#101117', '#0C0D12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Header: Title on Left, Avg Steps on Right */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Weekly Activity</Text>
          <View style={styles.avgContainer}>
            <Text style={styles.avgValue}>{avgSteps || '8,426'}</Text>
            <Text style={styles.avgLabel}>avg. steps</Text>
          </View>
        </View>

        {/* 7 Vertical Capsule Bars */}
        <View style={styles.barsContainer}>
          {chartDays.map((item) => {
            const fillHeight = item.value > 0 ? Math.max(Math.round((item.value / 100) * trackHeight), 12) : 0;
            const isFlameGradient = item.isCompleted && item.value > 0;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.barColumn}
                onPress={() => handleBarPress(item.id)}
                activeOpacity={0.75}
              >
                {/* Capsule Track */}
                <View style={[styles.capsuleTrack, { height: trackHeight }]}>
                  {fillHeight > 0 ? (
                    isFlameGradient ? (
                      <LinearGradient
                        colors={['#FE5B01', '#FF3B30', '#D82618']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[styles.capsuleFill, { height: fillHeight }]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.capsuleFill,
                          {
                            height: fillHeight,
                            backgroundColor: '#282F3E',
                          },
                        ]}
                      />
                    )
                  ) : null}
                </View>

                {/* Day Label */}
                <Text style={styles.dayLabel}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#222530',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  cardGradient: {
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  avgContainer: {
    alignItems: 'flex-end',
  },
  avgValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  avgLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#8A8F9E',
    marginTop: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  capsuleTrack: {
    width: 14,
    backgroundColor: '#1E222D',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 12,
  },
  capsuleFill: {
    width: '100%',
    borderRadius: 7,
  },
  dayLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12.5,
    color: '#71788E',
  },
});
