import { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';

import { colors, typography } from '../../theme';

interface AvatarProps {
  uri?: string;
  displayName?: string;
  size?: number;
}

function initialsFrom(name?: string): string {
  if (!name) return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase() || trimmed[0]!.toUpperCase();
}

function AvatarBase({ uri, displayName, size = 32 }: AvatarProps) {
  const sizeStyle = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.root, sizeStyle]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, sizeStyle]}
          contentFit="cover"
          transition={120}
          cachePolicy="memory-disk"
        />
      ) : null}
      {!uri && (
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.42) }]}>
          {initialsFrom(displayName)}
        </Text>
      )}
    </View>
  );
}

export const Avatar = memo(AvatarBase);

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.skeleton,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  initials: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
