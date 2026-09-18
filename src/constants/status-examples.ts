import type { StatusCategory } from '@/types/status';

export const STATUS_EXAMPLES: Record<StatusCategory, string[]> = {
  bar: [
    'Qui pour une bière ce soir place du Ralliement ?',
    'Apéro sur les quais, tout le monde est le bienvenu !',
    'Je cherche du monde pour un afterwork au Chabada.',
  ],
  sport: [
    'Match de foot improvisé au parc de Balzac, venez nombreux !',
    'Footing autour du lac de Maine ce soir, qui embarque ?',
    'Session basket au city stade, il manque des joueurs.',
  ],
  etude: [
    'Session révisions à la BU, motivation collective bienvenue.',
    'Qui veut réviser le partiel de demain autour d\'un café ?',
    'Groupe de travail à la bibliothèque universitaire, places libres.',
  ],
};
