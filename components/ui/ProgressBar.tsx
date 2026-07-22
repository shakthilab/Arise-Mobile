import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type ProgressBarProps = {
  progress: number; // 0..1
  color?: string;
  height?: number;
};

export function ProgressBar({ progress, color = colors.accentPrimary, height = 8 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(progress, 1));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped * 100}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  fill: {
    height: '100%',
  },
});
