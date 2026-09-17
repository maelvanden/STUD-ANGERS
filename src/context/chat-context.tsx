import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

import type { ChatMessage } from '@/types/status';

const STORAGE_KEY = 'studangers.chats.v1';

const AUTO_REPLIES = [
  'Carrément, ça marche pour moi !',
  "Nickel, on se retrouve là-bas 😄",
  'Avec plaisir, à tout à l’heure !',
];

type ChatsMap = Record<string, ChatMessage[]>;

type ChatContextValue = {
  getMessages: (statusId: string) => ChatMessage[];
  startThread: (statusId: string, authorName: string) => void;
  sendMessage: (statusId: string) => (text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function makeMessage(author: ChatMessage['author'], text: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, author, text, createdAt: new Date().toISOString() };
}

export function ChatProvider({ children }: PropsWithChildren) {
  const [chats, setChats] = useState<ChatsMap>({});
  const replyIndex = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setChats(JSON.parse(raw));
    });
  }, []);

  const getMessages = useCallback((statusId: string) => chats[statusId] ?? [], [chats]);

  const startThread = useCallback(
    (statusId: string, authorName: string) => {
      setChats((current) => {
        if (current[statusId]?.length) return current;
        const next = { ...current, [statusId]: [makeMessage('them', `Salut, merci pour ton message ! Content·e que ça t'intéresse 🙂 — ${authorName}`)] };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const sendMessage = useCallback(
    (statusId: string) => (text: string) => {
      setChats((current) => {
        const thread = current[statusId] ?? [];
        const withMine = [...thread, makeMessage('me', text)];
        const next = { ...current, [statusId]: withMine };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      setTimeout(() => {
        const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
        replyIndex.current += 1;
        setChats((current) => {
          const thread = current[statusId] ?? [];
          const next = { ...current, [statusId]: [...thread, makeMessage('them', reply)] };
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }, 1200);
    },
    []
  );

  return (
    <ChatContext.Provider value={{ getMessages, startThread, sendMessage }}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
