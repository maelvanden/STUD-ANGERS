import { useEffect } from 'react';

import { useAuth } from '@/context/auth-context';
import { registerForPushNotifications } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';

export function usePushRegistration() {
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;
    let isMounted = true;
    const userId = profile.id;

    async function register() {
      const token = await registerForPushNotifications();
      if (!token || !isMounted) return;
      await supabase.from('push_tokens').upsert({ user_id: userId, token }, { onConflict: 'token' });
    }

    register();

    return () => {
      isMounted = false;
    };
  }, [profile]);
}
