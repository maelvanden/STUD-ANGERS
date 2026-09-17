export type StatusCategory = 'bar' | 'sport' | 'etude';

export type Status = {
  id: string;
  authorName: string;
  authorSchool: string;
  content: string;
  category: StatusCategory;
  createdAt: string;
  isMine: boolean;
};

export type ChatMessage = {
  id: string;
  author: 'me' | 'them';
  text: string;
  createdAt: string;
};
