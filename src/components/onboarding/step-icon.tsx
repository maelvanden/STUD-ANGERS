import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  stepKey: number;
};

export function StepIcon({ name, stepKey }: Props) {
  const theme = useTheme();

  return (
    <Animated.View
      key={stepKey}
      entering={ZoomIn.duration(300)}
      style={[styles.badge, { borderColor: theme.tint, backgroundColor: theme.backgroundElement }]}>
      <Ionicons name={name} size={30} color={theme.tint} />
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
