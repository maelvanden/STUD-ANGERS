import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function AuthBackground({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.background, theme.backgroundSelected, theme.background]}
      locations={[0, 0.55, 1]}
      style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
