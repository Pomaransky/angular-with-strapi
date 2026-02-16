import { inject, Injectable } from '@angular/core';
import { SupportedLanguages } from '../constants';
import { Locale } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { AppStore } from '../store/app.store';

const LOCALES: Record<SupportedLanguages, Locale> = {
  [SupportedLanguages.EN]: enUS,
  [SupportedLanguages.PL]: pl,
};

@Injectable({
  providedIn: 'root',
})
export class DateFnsLocaleService {
  private appStore = inject(AppStore);

  getLocale(): Locale {
    const lang = this.appStore.language();
    return LOCALES[lang] ?? enUS;
  }
}
