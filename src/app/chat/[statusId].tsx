import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useChat } from '@/context/chat-context';
import { useTheme } from '@/hooks/use-theme';
import type { ChatMessage } from '@/types/status';

export default function ChatScreen() {
  const { statusId } = useLocalSearchParams<{ statusId: string }>();
  const { getMessages, sendMessage } = useChat();
  const theme = useTheme();
  const [draft, setDraft] = useState('');
  const messages = getMessages(statusId);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    sendMessage(statusId)(text);
    setDraft('');
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    const isMine = item.author === 'me';
    return (
      <ThemedView
        type="backgroundElement"
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleTheirs,
          { backgroundColor: isMine ? theme.tint : theme.backgroundElement },
        ]}>
        <ThemedText style={{ color: isMine ? theme.background : theme.text }}>{item.text}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex} keyboardVerticalOffset={90}>
        <SafeAreaView style={styles.flex} edges={['bottom']}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
          />

          <ThemedView type="backgroundElement" style={[styles.inputRow, { borderTopColor: theme.border }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Écris un message..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundSelected }]}
              onSubmitEditing={handleSend}
            />
            <Pressable onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.tint }]}>
              <Ionicons name="send" size={18} color={theme.background} />
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  list: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: Spacing.half,
  },
  bubbleTheirs: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Spacing.half,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
