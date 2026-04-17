import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../common/Avatar';
import { colors, spacing, typography } from '../../theme';
import type { Author } from '../../api/types';

interface AuthorRowProps {
  author: Author;
}

function AuthorRowBase({ author }: AuthorRowProps) {
  return (
    <View style={styles.row}>
      <Avatar uri={author.avatarUrl} displayName={author.displayName} size={32} />
      <Text style={styles.name} numberOfLines={1}>
        {author.displayName}
      </Text>
    </View>
  );
}

export const AuthorRow = memo(AuthorRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flexShrink: 1,
  },
});
