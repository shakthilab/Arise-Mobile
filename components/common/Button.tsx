import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  labelStyle,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        style,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000000' : colors.textPrimary} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.label,
              variantTextStyles[variant],
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 1.5,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#FFFFFF',
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#26262A',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});


const variantTextStyles = StyleSheet.create({
  primary: {
    color: '#000000',
  },
  secondary: {
    color: colors.textPrimary,
  },
  outline: {
    color: colors.textPrimary,
    fontFamily: fontFamilies.medium,
    letterSpacing: 0,
  },
  ghost: {
    color: colors.textPrimary,
  },
});

