import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { EPHEMERAL_DURATION_HOURS } from '@/constants/status-categories';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import type { Status, StatusCategory } from '@/types/status';

const EPHEMERAL_DURATION_MS = EPHEMERAL_DURATION_HOURS * 60 * 60 * 1000;

type StatusRow = {
  id: string;
  user_id: string;
  author_name: string;
  author_school: string;
  content: string;
  category: StatusCategory;
  created_at: string;
  expires_at: string;
};

function mapRow(row: StatusRow, myUserId: string | undefined): Status {
  return {
    id: row.id,
    authorId: row.user_id,
    authorName: row.author_name,
    authorSchool: row.author_school,
    content: row.content,
    category: row.category,
    createdAt: row.created_at,
    isMine: row.user_id === myUserId,
  };
}

type StatusesContextValue = {
  statuses: Status[];
  isLoading: boolean;
  addStatus: (content: string, category: StatusCategory) => Promise<void>;
};

const StatusesContext = createContext<StatusesContextValue | null>(null);

export function StatusesProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [rows, setRows] = useState<StatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!profile) {
        if (isMounted) {
          setRows([]);
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('statuses')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (isMounted && data) setRows(data);
      if (isMounted) setIsLoading(false);
    }

    load();

    if (!profile) return;

    const channel = supabase
      .channel('public:statuses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'statuses' }, (payload) => {
        const newRow = payload.new as StatusRow;
        setRows((current) => (current.some((row) => row.id === newRow.id) ? current : [newRow, ...current]));
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const value = useMemo<StatusesContextValue>(
    () => ({
      statuses: rows.map((row) => mapRow(row, profile?.id)),
      isLoading,
      async addStatus(content, category) {
        if (!profile) return;
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + EPHEMERAL_DURATION_MS);
        const { data } = await supabase
          .from('statuses')
          .insert({
            user_id: profile.id,
            author_name: profile.firstName,
            author_school: profile.school,
            content,
            category,
            created_at: createdAt.toISOString(),
            expires_at: expiresAt.toISOString(),
          })
          .select()
          .single();

        if (data) {
          setRows((current) => (current.some((row) => row.id === data.id) ? current : [data, ...current]));
        }
      },
    }),
    [rows, isLoading, profile]
  );

  return <StatusesContext.Provider value={value}>{children}</StatusesContext.Provider>;
}

export function useStatuses() {
  const ctx = useContext(StatusesContext);
  if (!ctx) throw new Error('useStatuses must be used within a StatusesProvider');
  return ctx;
}
