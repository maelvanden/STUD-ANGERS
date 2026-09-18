// Supabase Edge Function — envoie une notification push Expo à la réception
// d'un nouveau message privé.
//
// Déploiement (dashboard, sans CLI) :
// 1. Dashboard Supabase > Edge Functions > Create a new function
// 2. Nom : "notify-new-message"
// 3. Colle le contenu de ce fichier, puis Deploy
// 4. Dashboard > Database > Webhooks > Create a new webhook
//    - Table : messages
//    - Events : Insert
//    - Type : Supabase Edge Functions
//    - Function : notify-new-message

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const payload = await req.json();
  const record = payload.record as {
    status_id: string;
    status_author_id: string;
    participant_id: string;
    sender_id: string;
    sender_name: string;
    content: string;
  };

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const recipientId =
    record.sender_id === record.status_author_id ? record.participant_id : record.status_author_id;

  const { data: tokens } = await supabase.from('push_tokens').select('token').eq('user_id', recipientId);

  if (!tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ skipped: true }), { status: 200 });
  }

  const messages = tokens.map((row: { token: string }) => ({
    to: row.token,
    title: record.sender_name,
    body: record.content,
    data: {
      statusId: record.status_id,
      authorId: record.status_author_id,
      participantId: record.participant_id,
    },
  }));

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(messages),
  });

  return new Response(JSON.stringify({ sent: messages.length }), { status: 200 });
});
