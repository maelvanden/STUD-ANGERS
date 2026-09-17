export type InterestTagId = 'sport' | 'fete' | 'revisions' | 'musique' | 'culture' | 'benevolat';

export type StudentProfile = {
  id: string;
  email: string;
  firstName: string;
  age: number;
  school: string;
  bio: string;
  tags: InterestTagId[];
};
