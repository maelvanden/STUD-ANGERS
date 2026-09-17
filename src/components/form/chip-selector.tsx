import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { selectionHaptic } from '@/lib/haptics';

type Chip = {
  id: string;
  label: string;
};

type Props = {
  chips: readonly Chip[];
  selected: readonly string[];
  onToggle: (id: string) => void;
};

export function ChipSelector({ chips, selected, onToggle }: Props) {
  return (
    <View style={styles.wrap}>
      {chips.map((chip) => (
        <AnimatedChip
          key={chip.id}
          label={chip.label}
          isSelected={selected.includes(chip.id)}
          onPress={() => {
            selectionHaptic();
            onToggle(chip.id);
          }}
        />
      ))}
    </View>
  );
}

function AnimatedChip({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.06 : 1, { damping: 8, stiffness: 220 });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? theme.tint : theme.backgroundElement,
            borderColor: isSelected ? theme.tint : theme.border,
          },
        ]}>
        <ThemedText type="small" style={{ color: isSelected ? theme.background : theme.text }}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
