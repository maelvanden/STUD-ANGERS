import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Mascot } from '@/components/onboarding/mascot';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const SPARKLES = ['✨', '🎉', '💜', '⭐️', '🎊', '🚀'];
const RING_RADIUS = 70;
const RING_SIZE = 170;

const SPARKLE_POSITIONS = SPARKLES.map((_, index) => {
  const angle = (index / SPARKLES.length) * Math.PI * 2;
  return {
    left: RING_SIZE / 2 + RING_RADIUS * Math.cos(angle) - 12,
    top: RING_SIZE / 2 + RING_RADIUS * Math.sin(angle) - 12,
  };
});

type Props = {
  firstName: string;
};

export function CreatingAccount({ firstName }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.container}>
      <Animated.View style={styles.ring}>
        {SPARKLES.map((emoji, index) => (
          <Animated.View
            key={emoji}
            entering={ZoomIn.delay(index * 90).duration(300)}
            style={[styles.sparkle, SPARKLE_POSITIONS[index]]}>
            <Text style={styles.sparkleEmoji}>{emoji}</Text>
          </Animated.View>
        ))}
        <Mascot name="rocket-outline" stepKey={999} />
      </Animated.View>
      <ThemedText type="title" style={styles.text}>
        On prépare tout, {firstName || 'ça arrive'}…
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.six,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleEmoji: {
    fontSize: 24,
  },
  text: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
});
