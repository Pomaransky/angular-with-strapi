import { User } from "../auth/user.model";
import { RichTextContent } from "../rich-text.model";

export interface Post {
  documentId: string;
  title: string;
  content: RichTextContent;
  author: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}