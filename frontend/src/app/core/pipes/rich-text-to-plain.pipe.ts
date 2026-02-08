import { Pipe, PipeTransform } from '@angular/core';
import { RichTextContent, RichTextTextNode } from '../models';

@Pipe({
  name: 'richTextToPlain',
  standalone: true,
})
export class RichTextToPlainPipe implements PipeTransform {
  transform(content: RichTextContent | null | undefined): string {
    if (!content?.length) return '';
    return content
      .map((block) =>
        block.children
          .filter((c): c is RichTextTextNode => c.type === 'text')
          .map((c) => c.text)
          .join('')
      )
      .join('\n');
  }
}
