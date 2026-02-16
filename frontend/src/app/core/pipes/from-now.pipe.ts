import { Pipe, PipeTransform, inject } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { DateFnsLocaleService } from '../services/date-fns-locale-service';

@Pipe({
  name: 'dateFromNow',
  standalone: true,
  pure: false,
})
export class DateFromNowPipe implements PipeTransform {
  private dateFnsLocale = inject(DateFnsLocaleService);

  transform(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    const locale = this.dateFnsLocale.getLocale();
    return formatDistanceToNow(date, { addSuffix: true, locale });
  }
}
