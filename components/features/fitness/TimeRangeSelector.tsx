import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fontFamilies } from '@/theme/typography';
import { TimeRange } from '@/store/useMetricsStore';

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

const RANGES: TimeRange[] = ['Today', 'Week', 'Month', 'Year'];

export function TimeRangeSelector({ selected, onSelect }: TimeRangeSelectorProps) {
  const handleSelect = (range: TimeRange) => {
    if (range !== selected) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(range);
    }
  };

  return (
    <View style={styles.container}>
      {RANGES.map((range) => {
        const isSelected = range === selected;
        return (
          <TouchableOpacity
            key={range}
            style={[styles.pill, isSelected && styles.activePill]}
            onPress={() => handleSelect(range)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isSelected && styles.activePillText]}>
              {range}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F0F12',
    borderRadius: 22,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  activePill: {
    backgroundColor: '#5C171C',
    borderWidth: 1,
    borderColor: '#87232B',
    shadowColor: '#FF2A40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  pillText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#71717A',
  },
  activePillText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
});
