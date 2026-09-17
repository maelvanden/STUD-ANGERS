import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapHaptic } from '@/lib/haptics';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
};

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  function handlePress() {
    tapHaptic();
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.tint : 'transparent',
          borderColor: theme.tint,
          borderWidth: isPrimary ? 0 : 1,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? theme.background : theme.tint} />
      ) : (
        <ThemedText type="smallBold" style={{ color: isPrimary ? theme.background : theme.tint }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
