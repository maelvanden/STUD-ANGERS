import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  step: number;
  total: number;
};

export function OnboardingProgress({ step, total }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        {Array.from({ length: total }).map((_, index) => (
          <Segment key={index} filled={index < step} color={theme.tint} background={theme.backgroundElement} />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Étape {step} sur {total}
      </ThemedText>
    </View>
  );
}

function Segment({ filled, color, background }: { filled: boolean; color: string; background: string }) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(filled ? color : background, { duration: 250 }),
  }));

  return <Animated.View style={[styles.segment, animatedStyle]} />;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  track: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
});
