import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { EPHEMERAL_DURATION_HOURS } from '@/constants/status-categories';
import { useAuth } from '@/context/auth-context';
import { SEED_STATUSES } from '@/data/seed-statuses';
import type { Status, StatusCategory } from '@/types/status';

const STORAGE_KEY = 'studangers.statuses.v1';
const EPHEMERAL_DURATION_MS = EPHEMERAL_DURATION_HOURS * 60 * 60 * 1000;

function isExpired(createdAt: string, now: Date) {
  return now.getTime() - new Date(createdAt).getTime() > EPHEMERAL_DURATION_MS;
}

function buildSeedStatuses(now: Date): Status[] {
  return SEED_STATUSES.map((seed) => ({
    id: seed.id,
    authorName: seed.authorName,
    authorSchool: seed.authorSchool,
    content: seed.content,
    category: seed.category,
    createdAt: new Date(now.getTime() - seed.minutesAgo * 60 * 1000).toISOString(),
    isMine: false,
  }));
}

type StatusesContextValue = {
  statuses: Status[];
  addStatus: (content: string, category: StatusCategory) => Promise<void>;
};

const StatusesContext = createContext<StatusesContextValue | null>(null);

export function StatusesProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [myStatuses, setMyStatuses] = useState<Status[]>([]);
  const [seedStatuses] = useState<Status[]>(() => buildSeedStatuses(new Date()));

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setMyStatuses(JSON.parse(raw));
    });
  }, []);

  const value = useMemo<StatusesContextValue>(() => {
    const now = new Date();
    const all = [...myStatuses, ...seedStatuses]
      .filter((status) => !isExpired(status.createdAt, now))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      statuses: all,
      async addStatus(content, category) {
        if (!profile) return;
        const newStatus: Status = {
          id: `status-${Date.now()}`,
          authorName: profile.firstName,
          authorSchool: profile.school,
          content,
          category,
          createdAt: new Date().toISOString(),
          isMine: true,
        };
        const next = [newStatus, ...myStatuses];
        setMyStatuses(next);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
    };
  }, [myStatuses, seedStatuses, profile]);

  return <StatusesContext.Provider value={value}>{children}</StatusesContext.Provider>;
}

export function useStatuses() {
  const ctx = useContext(StatusesContext);
  if (!ctx) throw new Error('useStatuses must be used within a StatusesProvider');
  return ctx;
}
