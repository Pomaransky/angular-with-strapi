import { User } from '../auth/user.model';
import { Media } from '../media.type';
import { RichTextContent } from '../rich-text.model';

export interface Post {
  id: number;
  documentId: string;
  title: string;
  content: RichTextContent;
  author: User;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  commentsTotal: number;
  media?: Media;
}
