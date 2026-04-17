import { memo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Icon } from '../common/Icon';
import { colors, radius, spacing, typography } from '../../theme';

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

function CommentInputBase({ onSubmit, disabled }: CommentInputProps) {
  const [value, setValue] = useState('');
  const [pending, setPending] = useState(false);

  const trimmed = value.trim();
  const canSubmit = !disabled && !pending && trimmed.length > 0 && trimmed.length <= 500;

  const handleSend = async () => {
    if (!canSubmit) return;
    setPending(true);
    try {
      await onSubmit(trimmed);
      setValue('');
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Ваш комментарий"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
        maxLength={500}
        editable={!disabled && !pending}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSubmit}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={({ pressed }) => [
          styles.send,
          !canSubmit && styles.sendDisabled,
          pressed && canSubmit && styles.sendPressed,
        ]}
      >
        {pending ? (
          <ActivityIndicator color={colors.textInverse} size="small" />
        ) : (
          <Icon
            name="send"
            size={18}
            color={canSubmit ? colors.textInverse : colors.textMuted}
          />
        )}
      </Pressable>
    </View>
  );
}

export const CommentInput = memo(CommentInputBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingLeft: spacing.lg,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    paddingVertical: 8,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'center',
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: colors.primaryTint,
  },
  sendPressed: {
    backgroundColor: colors.primaryPressed,
  },
});
