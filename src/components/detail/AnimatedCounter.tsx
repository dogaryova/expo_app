import { memo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: number;
  style?: StyleProp<TextStyle>;
}

function AnimatedCounterBase({ value, style }: AnimatedCounterProps) {
  const prevRef = useRef(value);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (prevRef.current === value) return;
    progress.value = 0;
    progress.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
    const timer = setTimeout(() => {
      prevRef.current = value;
    }, 260);
    return () => clearTimeout(timer);
  }, [value, progress]);

  const prevStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -8 * progress.value }],
  }));

  const nextStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: 12 * (1 - progress.value) }],
  }));

  if (prevRef.current === value) {
    return <Text style={style}>{value}</Text>;
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.layer, style, prevStyle]}>
        {prevRef.current}
      </Animated.Text>
      <Animated.Text style={[style, nextStyle]}>{value}</Animated.Text>
    </View>
  );
}

export const AnimatedCounter = memo(AnimatedCounterBase);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  layer: { position: 'absolute' },
});
