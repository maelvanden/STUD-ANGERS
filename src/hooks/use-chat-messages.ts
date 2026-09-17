import { useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/types/message';

type MessageRow = {
  id: string;
  status_id: string;
  status_author_id: string;
  participant_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

function mapRow(row: MessageRow): Message {
  return {
    id: row.id,
    statusId: row.status_id,
    statusAuthorId: row.status_author_id,
    participantId: row.participant_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function useChatMessages(statusId: string, authorId: string, participantId: string) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('status_id', statusId)
        .eq('participant_id', participantId)
        .order('created_at', { ascending: true });

      if (isMounted) {
        setMessages(data ? (data as MessageRow[]).map(mapRow) : []);
        setIsLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`messages:${statusId}:${participantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const row = payload.new as MessageRow;
        if (row.status_id !== statusId || row.participant_id !== participantId) return;
        setMessages((current) => (current.some((m) => m.id === row.id) ? current : [...current, mapRow(row)]));
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [statusId, participantId]);

  async function sendMessage(content: string) {
    if (!profile) return;
    await supabase.from('messages').insert({
      status_id: statusId,
      status_author_id: authorId,
      participant_id: participantId,
      sender_id: profile.id,
      sender_name: profile.firstName,
      content,
    });
  }

  return { messages, isLoading, sendMessage };
}
