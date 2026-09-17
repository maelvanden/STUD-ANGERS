import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ChatProvider } from '@/context/chat-context';
import { StatusesProvider } from '@/context/statuses-context';
import { useTheme } from '@/hooks/use-theme';

function RootNavigator() {
  const { isLoading, profile } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!profile}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="partner/[id]"
          options={{
            headerShown: true,
            title: 'Partenaire',
            presentation: 'modal',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
        <Stack.Screen
          name="new-status"
          options={{
            headerShown: true,
            title: 'Nouveau statut',
            presentation: 'modal',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
        <Stack.Screen
          name="chat/[statusId]"
          options={{
            headerShown: true,
            title: 'Discussion',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!profile}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthProvider>
        <StatusesProvider>
          <ChatProvider>
            <RootNavigator />
          </ChatProvider>
        </StatusesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
