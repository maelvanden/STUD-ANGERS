import { useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export type Conversation = {
  key: string;
  statusId: string;
  authorId: string;
  participantId: string;
  otherName: string;
  statusContent: string;
  lastMessage: string;
  lastMessageAt: string;
  isLastMessageMine: boolean;
};

type Row = {
  status_id: string;
  status_author_id: string;
  participant_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  statuses: { content: string; author_name: string } | null;
};

function buildConversations(rows: Row[], myId: string): Conversation[] {
  const latestByThread = new Map<string, Row>();
  const participantNameByThread = new Map<string, string>();

  for (const row of rows) {
    const key = `${row.status_id}:${row.participant_id}`;
    if (!latestByThread.has(key)) latestByThread.set(key, row);
    if (row.sender_id === row.participant_id && !participantNameByThread.has(key)) {
      participantNameByThread.set(key, row.sender_name);
    }
  }

  return Array.from(latestByThread.entries()).map(([key, row]) => {
    const isAuthor = row.status_author_id === myId;
    const otherName = isAuthor
      ? (participantNameByThread.get(key) ?? 'Un·e étudiant·e')
      : (row.statuses?.author_name ?? 'L’auteur·ice du statut');

    return {
      key,
      statusId: row.status_id,
      authorId: row.status_author_id,
      participantId: row.participant_id,
      otherName,
      statusContent: row.statuses?.content ?? '',
      lastMessage: row.content,
      lastMessageAt: row.created_at,
      isLastMessageMine: row.sender_id === myId,
    };
  });
}

export function useConversations() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!profile) {
        if (isMounted) {
          setConversations([]);
          setIsLoading(false);
        }
        return;
      }

      const myId = profile.id;
      const { data } = await supabase
        .from('messages')
        .select('*, statuses(content, author_name)')
        .or(`status_author_id.eq.${myId},participant_id.eq.${myId}`)
        .order('created_at', { ascending: false });

      if (isMounted) {
        setConversations(data ? buildConversations(data as Row[], myId) : []);
        setIsLoading(false);
      }
    }

    load();

    if (!profile) return;

    const channel = supabase
      .channel('messages:inbox')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        load();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return { conversations, isLoading };
}
