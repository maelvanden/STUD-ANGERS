import type { StatusCategory } from '@/types/status';

export const SEED_STATUSES: {
  id: string;
  authorName: string;
  authorSchool: string;
  content: string;
  category: StatusCategory;
  minutesAgo: number;
}[] = [
  {
    id: 'seed-1',
    authorName: 'Lucas',
    authorSchool: 'ESEO',
    content: 'Qui pour une bière ce soir place du Ralliement ?',
    category: 'bar',
    minutesAgo: 25,
  },
  {
    id: 'seed-2',
    authorName: 'Sofia',
    authorSchool: "Université d'Angers",
    content: 'Cherche 2 personnes pour un futsal ce week-end, niveau détente !',
    category: 'sport',
    minutesAgo: 90,
  },
  {
    id: 'seed-3',
    authorName: 'Hugo',
    authorSchool: 'UCO Angers',
    content: 'Qui révise à la BU Saint-Serge cet aprem ? Motivation collective svp',
    category: 'etude',
    minutesAgo: 40,
  },
  {
    id: 'seed-4',
    authorName: 'Chloé',
    authorSchool: 'ESSCA',
    content: 'Sortie resto-bar ce soir dans le centre, motivé·e ?',
    category: 'bar',
    minutesAgo: 150,
  },
  {
    id: 'seed-5',
    authorName: 'Nathan',
    authorSchool: 'Agrocampus Ouest',
    content: 'Footing autour du lac de Maine demain matin, qui suit ?',
    category: 'sport',
    minutesAgo: 300,
  },
];
