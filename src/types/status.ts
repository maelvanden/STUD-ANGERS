export type StatusCategory = 'bar' | 'sport' | 'etude';

export type Status = {
  id: string;
  authorId: string;
  authorName: string;
  authorSchool: string;
  content: string;
  category: StatusCategory;
  createdAt: string;
  isMine: boolean;
};
