import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { SupabaseConfigNeeded } from '@/components/supabase-config-needed';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { StatusesProvider } from '@/context/statuses-context';
import { usePushRegistration } from '@/hooks/use-push-registration';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured } from '@/lib/supabase';

type MessageNotificationData = {
  statusId: string;
  authorId: string;
  participantId: string;
};

function RootNavigator() {
  const { isLoading, profile } = useAuth();
  const theme = useTheme();

  usePushRegistration();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Partial<MessageNotificationData>;
      if (data.statusId && data.authorId && data.participantId) {
        router.push(`/chat/${data.statusId}?authorId=${data.authorId}&participantId=${data.participantId}`);
      }
    });

    return () => subscription.remove();
  }, []);

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
        <Stack.Screen
          name="edit-profile"
          options={{
            headerShown: true,
            title: 'Modifier mon profil',
            presentation: 'modal',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            headerShown: true,
            title: 'Événement',
            presentation: 'modal',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        />
        <Stack.Screen
          name="conversations"
          options={{
            headerShown: true,
            title: 'Mes discussions',
            presentation: 'modal',
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
      {isSupabaseConfigured ? (
        <AuthProvider>
          <StatusesProvider>
            <RootNavigator />
          </StatusesProvider>
        </AuthProvider>
      ) : (
        <SupabaseConfigNeeded />
      )}
    </ThemeProvider>
  );
}
