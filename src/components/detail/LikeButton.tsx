import { memo, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AnimatedCounter } from './AnimatedCounter';
import { colors, spacing, typography } from '../../theme';

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onToggle: () => void;
  disabled?: boolean;
  size?: number;
}

function LikeButtonBase({
  isLiked,
  likesCount,
  onToggle,
  disabled,
  size = 22,
}: LikeButtonProps) {
  const scale = useSharedValue(1);
  const liked = useSharedValue(isLiked ? 1 : 0);

  useEffect(() => {
    liked.value = withTiming(isLiked ? 1 : 0, { duration: 180 });
  }, [isLiked, liked]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      liked.value,
      [0, 1],
      [colors.textSecondary, colors.danger],
    );
    return { color };
  });

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSequence(
      withTiming(0.85, { duration: 90, easing: Easing.out(Easing.quad) }),
      withTiming(1.2, { duration: 140, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 120, easing: Easing.out(Easing.cubic) }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    >
      <Animated.View style={[styles.row, containerStyle]}>
        <AnimatedIonicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={size}
          style={iconStyle}
        />
        <AnimatedCounter
          value={likesCount}
          style={[styles.count, isLiked && { color: colors.danger }]}
        />
      </Animated.View>
    </Pressable>
  );
}

export const LikeButton = memo(LikeButtonBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  count: {
    ...typography.captionMedium,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    minWidth: 20,
  },
});
