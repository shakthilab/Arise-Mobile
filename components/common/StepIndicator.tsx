import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  const currentFormatted = String(Math.min(currentStep + 1, totalSteps)).padStart(2, '0');
  const totalFormatted = String(totalSteps).padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Current Step Number (e.g., 01) in Gold */}
      <Text style={styles.activeNumber}>{currentFormatted}</Text>

      {/* Horizontal Bar Segments */}
      <View style={styles.barsContainer}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const isActive = i <= currentStep;
          return (
            <View
              key={i}
              style={[
                styles.barSegment,
                isActive ? styles.barActive : styles.barInactive,
              ]}
            />
          );
        })}
      </View>

      {/* Total Steps Number (e.g., 06) */}
      <Text style={styles.totalNumber}>{totalFormatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  activeNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: colors.accentGold,
    marginRight: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  totalNumber: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: '#71717A',
    marginLeft: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  barActive: {
    backgroundColor: colors.accentGold,
  },
  barInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});



