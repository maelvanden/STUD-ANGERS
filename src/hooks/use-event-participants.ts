import { useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export type EventParticipant = {
  userId: string;
  name: string;
  school: string;
};

type ActionResult = { success: true } | { success: false; error: string };

type ParticipantRow = {
  user_id: string;
  participant_name: string;
  participant_school: string;
};

function mapRows(rows: ParticipantRow[]): EventParticipant[] {
  return rows.map((row) => ({
    userId: row.user_id,
    name: row.participant_name,
    school: row.participant_school,
  }));
}

async function fetchParticipants(eventId: string): Promise<EventParticipant[]> {
  const { data } = await supabase
    .from('event_participants')
    .select('user_id, participant_name, participant_school')
    .eq('event_id', eventId)
    .order('created_at');

  return data ? mapRows(data as ParticipantRow[]) : [];
}

export function useEventParticipants(eventId: string) {
  const { profile } = useAuth();
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const rows = await fetchParticipants(eventId);
      if (isMounted) {
        setParticipants(rows);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const isParticipating = participants.some((participant) => participant.userId === profile?.id);

  async function refresh() {
    const rows = await fetchParticipants(eventId);
    setParticipants(rows);
  }

  async function join(): Promise<ActionResult> {
    if (!profile) return { success: false, error: 'Tu dois être connecté·e.' };
    const { error } = await supabase.from('event_participants').insert({
      event_id: eventId,
      user_id: profile.id,
      participant_name: profile.firstName,
      participant_school: profile.school,
    });
    if (error) return { success: false, error: error.message };
    await refresh();
    return { success: true };
  }

  async function leave(): Promise<ActionResult> {
    if (!profile) return { success: false, error: 'Tu dois être connecté·e.' };
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', profile.id);
    if (error) return { success: false, error: error.message };
    await refresh();
    return { success: true };
  }

  return { participants, isLoading, isParticipating, join, leave };
}
