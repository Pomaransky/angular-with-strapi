export interface RichTextTextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export type RichTextInlineNode = RichTextTextNode;

export interface RichTextBlock {
  type: 'heading' | 'paragraph' | 'list' | 'list-item' | 'quote' | 'code';
  children: RichTextInlineNode[];
  level?: number;
  format?: string;
}

export type RichTextContent = RichTextBlock[];
