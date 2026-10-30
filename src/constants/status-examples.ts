import type { StatusCategory } from '@/types/status';

export type StatusExample = {
  id: string;
  category: StatusCategory;
  authorName: string;
  authorSchool: string;
  content: string;
};

export const STATUS_EXAMPLES: StatusExample[] = [
  {
    id: 'example-bar-1',
    category: 'bar',
    authorName: 'Camille',
    authorSchool: 'ESEO',
    content: 'Qui pour une bière ce soir place du Ralliement ?',
  },
  {
    id: 'example-bar-2',
    category: 'bar',
    authorName: 'Lucas',
    authorSchool: "Université d'Angers",
    content: 'Apéro sur les quais, tout le monde est le bienvenu !',
  },
  {
    id: 'example-sport-1',
    category: 'sport',
    authorName: 'Manon',
    authorSchool: 'ESSCA',
    content: 'Match de foot improvisé au parc de Balzac, venez nombreux !',
  },
  {
    id: 'example-sport-2',
    category: 'sport',
    authorName: 'Hugo',
    authorSchool: "Université d'Angers",
    content: 'Footing autour du lac de Maine ce soir, qui embarque ?',
  },
  {
    id: 'example-etude-1',
    category: 'etude',
    authorName: 'Chloé',
    authorSchool: 'UCO Angers',
    content: 'Session révisions à la BU, motivation collective bienvenue.',
  },
  {
    id: 'example-etude-2',
    category: 'etude',
    authorName: 'Nathan',
    authorSchool: 'ESAIP',
    content: "Qui veut réviser le partiel de demain autour d'un café ?",
  },
];
