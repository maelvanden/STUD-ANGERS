-- Stud'Angers — schema initial (Étape 5)
-- À exécuter dans l'éditeur SQL de ton projet Supabase.
-- Ce script est idempotent : tu peux le relancer sans risque.

-- 1. Profils étudiants (complète auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null,
  age int not null,
  school text not null,
  bio text default '',
  tags text[] default '{}',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Un utilisateur peut lire son propre profil" on public.profiles;
create policy "Un utilisateur peut lire son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Un utilisateur peut créer son propre profil" on public.profiles;
create policy "Un utilisateur peut créer son propre profil"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Un utilisateur peut modifier son propre profil" on public.profiles;
create policy "Un utilisateur peut modifier son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Partenaires (bars / commerces)
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  happy_hour_start time not null,
  happy_hour_end time not null,
  exclusive_promo text not null,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;

create unique index if not exists partners_name_idx on public.partners (name);

drop policy if exists "Tout le monde peut lire les partenaires" on public.partners;
create policy "Tout le monde peut lire les partenaires"
  on public.partners for select
  using (true);

insert into public.partners (name, description, address, latitude, longitude, happy_hour_start, happy_hour_end, exclusive_promo)
values
  ('Le Ralliement', 'Bar à bières artisanales sur la place du Ralliement, terrasse chauffée l''hiver.', '2 Place du Ralliement, 49100 Angers', 47.4726, -0.5546, '17:00', '20:00', 'Pinte à 4€ au lieu de 6€'),
  ('La Doutre', 'Bar convivial dans le quartier de la Doutre, ambiance étudiante et concerts live.', '8 Rue Beaurepaire, 49100 Angers', 47.4735, -0.5636, '18:00', '21:00', '-30% sur les cocktails'),
  ('Le Quai Ligny', 'Vue sur la Maine, parfait pour l''apéro entre potes après les cours.', '5 Quai Ligny, 49100 Angers', 47.4747, -0.5602, '17:30', '19:30', '2 mojitos achetés = le 3e offert'),
  ('Saint-Laud Pub', 'Pub étudiant historique, écrans pour le sport et grand choix de bières.', '12 Rue Saint-Laud, 49100 Angers', 47.4713, -0.5567, '16:00', '19:00', 'Planche apéro offerte dès 3 pintes'),
  ('Le Comptoir Étudiant', 'À deux pas de la fac, l''adresse préférée pour réviser puis décompresser.', '3 Boulevard Foch, 49100 Angers', 47.4695, -0.5528, '17:00', '20:30', 'Café offert de 14h à 17h sur présentation de la carte'),
  ('La Buvette Angevine', 'Guinguette au bord de la Maine, DJ sets le jeudi soir.', '1 Rue de la Poissonnerie, 49100 Angers', 47.4739, -0.5619, '18:00', '20:00', 'Shooter offert pour toute commande')
on conflict (name) do nothing;

-- 3. Statuts éphémères
create table if not exists public.statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  author_school text not null,
  content text not null,
  category text not null check (category in ('bar', 'sport', 'etude')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

alter table public.statuses enable row level security;

drop policy if exists "Les utilisateurs connectés peuvent lire les statuts actifs" on public.statuses;
create policy "Les utilisateurs connectés peuvent lire les statuts actifs"
  on public.statuses for select
  to authenticated
  using (expires_at > now());

drop policy if exists "Un utilisateur peut créer ses propres statuts" on public.statuses;
create policy "Un utilisateur peut créer ses propres statuts"
  on public.statuses for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Un utilisateur peut supprimer ses propres statuts" on public.statuses;
create policy "Un utilisateur peut supprimer ses propres statuts"
  on public.statuses for delete
  to authenticated
  using (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'statuses'
  ) then
    alter publication supabase_realtime add table public.statuses;
  end if;
end $$;

-- 4. Événements étudiants
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  date timestamptz not null,
  location text not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create unique index if not exists events_title_idx on public.events (title);

drop policy if exists "Tout le monde peut lire les événements" on public.events;
create policy "Tout le monde peut lire les événements"
  on public.events for select
  using (true);

insert into public.events (title, description, date, location)
values
  ('Soirée d''intégration BDE', 'Soirée de rentrée organisée par le BDE, ambiance garantie.', now() + interval '3 days', 'Le Chabada, Angers'),
  ('Tournoi de futsal inter-écoles', 'Tournoi amical entre étudiants des écoles angevines.', now() + interval '7 days', 'Complexe sportif Jean Bouin'),
  ('Concert étudiant au Chabada', 'Scène ouverte aux groupes étudiants angevins.', now() + interval '10 days', 'Le Chabada, Angers')
on conflict (title) do nothing;

-- 4bis. Participants aux événements
create table if not exists public.event_participants (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  participant_name text not null,
  participant_school text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.event_participants enable row level security;

drop policy if exists "Les utilisateurs connectés voient les participants" on public.event_participants;
create policy "Les utilisateurs connectés voient les participants"
  on public.event_participants for select
  to authenticated
  using (true);

drop policy if exists "Un utilisateur peut s'inscrire à un événement" on public.event_participants;
create policy "Un utilisateur peut s'inscrire à un événement"
  on public.event_participants for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Un utilisateur peut se désinscrire d'un événement" on public.event_participants;
create policy "Un utilisateur peut se désinscrire d'un événement"
  on public.event_participants for delete
  to authenticated
  using (auth.uid() = user_id);

-- 4ter. Messages privés (mini-chat lié à un statut)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  status_id uuid not null references public.statuses (id) on delete cascade,
  status_author_id uuid not null references auth.users (id) on delete cascade,
  participant_id uuid not null references auth.users (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  sender_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_thread_idx on public.messages (status_id, participant_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "Les participants d'une discussion peuvent la lire" on public.messages;
create policy "Les participants d'une discussion peuvent la lire"
  on public.messages for select
  to authenticated
  using (auth.uid() = status_author_id or auth.uid() = participant_id);

drop policy if exists "Les participants d'une discussion peuvent écrire" on public.messages;
create policy "Les participants d'une discussion peuvent écrire"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and (auth.uid() = status_author_id or auth.uid() = participant_id)
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- 5. Stockage des photos de profil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Les photos de profil sont publiques" on storage.objects;
create policy "Les photos de profil sont publiques"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Un utilisateur peut ajouter sa propre photo" on storage.objects;
create policy "Un utilisateur peut ajouter sa propre photo"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Un utilisateur peut modifier sa propre photo" on storage.objects;
create policy "Un utilisateur peut modifier sa propre photo"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Un utilisateur peut supprimer sa propre photo" on storage.objects;
create policy "Un utilisateur peut supprimer sa propre photo"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
