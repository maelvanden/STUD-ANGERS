import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { supabase } from '@/lib/supabase';
import type { StudentProfile } from '@/types/profile';

const PENDING_PROFILE_KEY = 'studangers.pending_profile.v1';

type PendingProfile = Omit<StudentProfile, 'id' | 'email'>;

type RegisterInput = PendingProfile & {
  email: string;
  password: string;
};

type AuthResult = { success: true; needsEmailConfirmation?: boolean } | { success: false; error: string };

type AuthContextValue = {
  isLoading: boolean;
  profile: StudentProfile | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapRow(
  row: {
    first_name: string;
    age: number;
    school: string;
    bio: string | null;
    tags: string[] | null;
  },
  userId: string,
  email: string
): StudentProfile {
  return {
    id: userId,
    email,
    firstName: row.first_name,
    age: row.age,
    school: row.school,
    bio: row.bio ?? '',
    tags: (row.tags ?? []) as StudentProfile['tags'],
  };
}

async function createProfileRow(userId: string, email: string, pending: PendingProfile) {
  await supabase.from('profiles').insert({
    id: userId,
    email,
    first_name: pending.firstName,
    age: pending.age,
    school: pending.school,
    bio: pending.bio,
    tags: pending.tags,
  });
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  async function loadProfile(userId: string, email: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (data) {
      setProfile(mapRow(data, userId, email));
      setIsLoading(false);
      return;
    }

    const pendingKey = `${PENDING_PROFILE_KEY}:${email.toLowerCase()}`;
    const rawPending = await AsyncStorage.getItem(pendingKey);
    if (rawPending) {
      const pending: PendingProfile = JSON.parse(rawPending);
      await createProfileRow(userId, email, pending);
      await AsyncStorage.removeItem(pendingKey);
      setProfile({ id: userId, email, ...pending });
    } else {
      setProfile(null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) {
        loadProfile(session.user.id, session.user.email);
      } else {
        setIsLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email) {
        loadProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      profile,
      async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },
      async register({ email, password, ...pending }) {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) return { success: false, error: error.message };

        if (data.session && data.user?.email) {
          await createProfileRow(data.user.id, data.user.email, pending);
          await loadProfile(data.user.id, data.user.email);
          return { success: true };
        }

        await AsyncStorage.setItem(`${PENDING_PROFILE_KEY}:${email.trim().toLowerCase()}`, JSON.stringify(pending));
        return { success: true, needsEmailConfirmation: true };
      },
      async signOut() {
        await supabase.auth.signOut();
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
