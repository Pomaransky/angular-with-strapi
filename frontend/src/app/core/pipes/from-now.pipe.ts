import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'dateFromNow',
  standalone: true,
})
export class DateFromNowPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const date = new Date(value);

    return formatDistanceToNow(date, { addSuffix: true });
  }
}
