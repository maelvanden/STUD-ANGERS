# Stud'Angers

Application mobile pour les étudiants d'Angers : bons plans "Happy Hour" chez les
partenaires locaux, rencontres spontanées ("On fait quoi ce soir ?") et agenda des
événements étudiants.

## Stack technique

- [Expo](https://expo.dev) (SDK 57) + [expo-router](https://docs.expo.dev/router/introduction) (file-based routing)
- React Native + TypeScript
- [Supabase](https://supabase.com) : authentification, base de données Postgres, temps réel
- Navigation par onglets : Accueil, Carte, Événements, Profil
- Dark mode par défaut, palette violet électrique / cyan

## Configuration Supabase

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécute le contenu de [`supabase/schema.sql`](./supabase/schema.sql)
   (tables `profiles`, `partners`, `statuses`, `events`, policies RLS, données de départ pour
   les partenaires et événements).
3. Copie `.env.example` en `.env` et renseigne les valeurs trouvées dans
   *Project Settings > API* :
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```

Sans ce fichier `.env`, l'app affiche un écran "Configuration requise" au lancement.

## Démarrer le projet

```bash
npm install
npx expo start
```

Depuis la sortie de la commande, tu peux ouvrir l'app dans :

- un [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- un émulateur [Android](https://docs.expo.dev/workflow/android-studio-emulator/) ou [iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)
- le navigateur (`npx expo start --web`)

## Structure du projet

```
src/
  app/            écrans (file-based routing expo-router)
    (auth)/       connexion / inscription
    (tabs)/       navigation par onglets (Accueil, Carte, Événements, Profil)
    partner/      fiche détail d'un partenaire (modal)
    chat/         mini-chat privé lié à un statut
  components/     composants UI réutilisables
  constants/      thème, listes d'écoles/tags/catégories
  context/        auth, statuts éphémères, chat (React Context)
  hooks/          hooks partagés (thème, partenaires, événements)
  lib/            Supabase client, validations, formatage
  types/          types partagés
supabase/
  schema.sql      schéma + policies RLS + données de départ
```

## Feuille de route MVP

1. ✅ Architecture du projet et navigation par onglets
2. ✅ Authentification et profil étudiant
3. ✅ Carte / liste des Happy Hours et fiches partenaires
4. ✅ Statuts éphémères ("On fait quoi ce soir ?")
5. ✅ Intégration base de données (Supabase)

Le mini-chat reste pour l'instant local à l'appareil (pas de table dédiée dans le schéma
initial) — à faire évoluer si besoin d'une vraie messagerie multi-appareils.
