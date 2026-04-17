import { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'lg' | 'md' | 'sm';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function ButtonBase(props: ButtonProps) {
  const {
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    fullWidth,
    leftIcon,
    style,
    testID,
  } = props;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && variantPressed[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <View style={styles.inner}>
          {leftIcon}
          <Text
            style={[
              styles.label,
              { color: textColor[variant] },
              size === 'sm' && styles.labelSm,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export const Button = memo(ButtonBase);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: { alignSelf: 'stretch' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.button },
  labelSm: { ...typography.caption, fontWeight: '600' as const },
  disabled: { opacity: 0.5 },
});

const sizeStyles = StyleSheet.create({
  lg: { height: 52 },
  md: { height: 44 },
  sm: { height: 34, paddingHorizontal: spacing.lg },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryTint },
  ghost: { backgroundColor: 'transparent' },
});

const variantPressed = StyleSheet.create({
  primary: { backgroundColor: colors.primaryPressed },
  secondary: { opacity: 0.8 },
  ghost: { opacity: 0.6 },
});

const textColor: Record<Variant, string> = {
  primary: colors.textInverse,
  secondary: colors.primary,
  ghost: colors.primary,
};
