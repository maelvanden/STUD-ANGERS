# Stud'Angers

Application mobile pour les étudiants d'Angers : bons plans "Happy Hour" chez les
partenaires locaux, rencontres spontanées ("On fait quoi ce soir ?") et agenda des
événements étudiants.

## Stack technique

- [Expo](https://expo.dev) (SDK 57) + [expo-router](https://docs.expo.dev/router/introduction) (file-based routing)
- React Native + TypeScript
- Navigation par onglets : Accueil, Carte, Événements, Profil
- Dark mode par défaut, palette violet électrique / cyan

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
    (tabs)/       navigation par onglets (Accueil, Carte, Événements, Profil)
  components/     composants UI réutilisables
  constants/      thème (couleurs, espacements)
  hooks/          hooks partagés (thème, color scheme)
```

## Feuille de route MVP

1. ✅ Architecture du projet et navigation par onglets
2. ⬜ Authentification et profil étudiant
3. ⬜ Carte / liste des Happy Hours et fiches partenaires
4. ⬜ Statuts éphémères ("On fait quoi ce soir ?")
5. ⬜ Intégration base de données (Supabase)
