import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useConversations, type Conversation } from '@/hooks/use-conversations';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeTime } from '@/lib/time-format';

export default function ConversationsScreen() {
  const theme = useTheme();
  const { conversations, isLoading } = useConversations();

  function renderItem({ item }: { item: Conversation }) {
    return (
      <Pressable
        onPress={() =>
          router.push(`/chat/${item.statusId}?authorId=${item.authorId}&participantId=${item.participantId}`)
        }>
        {({ pressed }) => (
          <ThemedView
            type="backgroundElement"
            style={[styles.row, { borderColor: theme.border, opacity: pressed ? 0.85 : 1 }]}>
            <ThemedView type="backgroundSelected" style={styles.avatar}>
              <Ionicons name="person" size={18} color={theme.tint} />
            </ThemedView>
            <ThemedView type="backgroundElement" style={styles.rowContent}>
              <ThemedView type="backgroundElement" style={styles.rowHeader}>
                <ThemedText type="smallBold">{item.otherName}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatRelativeTime(item.lastMessageAt)}
                </ThemedText>
              </ThemedView>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {item.isLastMessageMine ? 'Toi : ' : ''}
                {item.lastMessage}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </Pressable>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Aucune discussion pour le moment. Réagis à un statut avec &quot;Je suis chaud&quot; pour en démarrer une !
              </ThemedText>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
