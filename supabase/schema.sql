-- Stud'Angers — schema initial (Étape 5)
-- À exécuter une fois dans l'éditeur SQL de ton projet Supabase.

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

create policy "Un utilisateur peut lire son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur peut créer son propre profil"
  on public.profiles for insert
  with check (auth.uid() = id);

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
on conflict do nothing;

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

create policy "Les utilisateurs connectés peuvent lire les statuts actifs"
  on public.statuses for select
  to authenticated
  using (expires_at > now());

create policy "Un utilisateur peut créer ses propres statuts"
  on public.statuses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Un utilisateur peut supprimer ses propres statuts"
  on public.statuses for delete
  to authenticated
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.statuses;

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

create policy "Tout le monde peut lire les événements"
  on public.events for select
  using (true);

insert into public.events (title, description, date, location)
values
  ('Soirée d''intégration BDE', 'Soirée de rentrée organisée par le BDE, ambiance garantie.', now() + interval '3 days', 'Le Chabada, Angers'),
  ('Tournoi de futsal inter-écoles', 'Tournoi amical entre étudiants des écoles angevines.', now() + interval '7 days', 'Complexe sportif Jean Bouin'),
  ('Concert étudiant au Chabada', 'Scène ouverte aux groupes étudiants angevins.', now() + interval '10 days', 'Le Chabada, Angers')
on conflict do nothing;
