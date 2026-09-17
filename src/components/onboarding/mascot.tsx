import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, ZoomIn } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  stepKey: number;
};

export function Mascot({ name, stepKey }: Props) {
  const theme = useTheme();
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(withTiming(-8, { duration: 900 }), withTiming(0, { duration: 900 })),
      -1,
      true
    );
  }, [floatY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View style={floatStyle}>
      <Animated.View
        key={stepKey}
        entering={ZoomIn.duration(350).springify().damping(9)}
        style={[styles.badge, { borderColor: theme.tint, backgroundColor: theme.backgroundElement }]}>
        <Ionicons name={name} size={30} color={theme.tint} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
