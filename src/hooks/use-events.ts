import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { StudEvent } from '@/types/event';

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
};

function mapRow(row: EventRow): StudEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    date: row.date,
    location: row.location,
  };
}

export function useEvents() {
  const [events, setEvents] = useState<StudEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('date')
      .then(({ data }) => {
        if (data) setEvents(data.map(mapRow));
        setIsLoading(false);
      });
  }, []);

  return { events, isLoading };
}
