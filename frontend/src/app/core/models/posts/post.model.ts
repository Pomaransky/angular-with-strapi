import { User } from '../auth/user.model';
import { RichTextContent } from '../rich-text.model';

export interface Post {
  documentId: string;
  title: string;
  content: RichTextContent;
  author: User;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  commentsTotal: number;
}
