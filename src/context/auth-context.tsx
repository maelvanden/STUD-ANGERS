import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import type { StudentProfile } from '@/types/profile';

const STORAGE_KEY = 'studangers.profile.v1';

type AuthContextValue = {
  isLoading: boolean;
  profile: StudentProfile | null;
  login: (email: string) => Promise<boolean>;
  register: (profile: StudentProfile) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setProfile(raw ? JSON.parse(raw) : null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      profile,
      async login(email) {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const stored: StudentProfile = JSON.parse(raw);
        if (stored.email.trim().toLowerCase() !== email.trim().toLowerCase()) return false;
        setProfile(stored);
        return true;
      },
      async register(newProfile) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        setProfile(newProfile);
      },
      async signOut() {
        setProfile(null);
      },
    }),
    [isLoading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
