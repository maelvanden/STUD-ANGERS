import { supabase } from '@/lib/supabase';

export async function uploadAvatarImage(userId: string, localUri: string): Promise<{ url?: string; error?: string }> {
  try {
    const response = await fetch(localUri);
    const arrayBuffer = await response.arrayBuffer();

    const extension = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
    const path = `${userId}/avatar.${extension}`;

    const { error } = await supabase.storage.from('avatars').upload(path, arrayBuffer, {
      contentType,
      upsert: true,
    });
    if (error) return { error: error.message };

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return { url: `${data.publicUrl}?v=${Date.now()}` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Impossible de téléverser la photo.' };
  }
}
