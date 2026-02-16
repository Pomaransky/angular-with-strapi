import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, switchMap, tap } from 'rxjs';
import { Theme, SupportedLanguages } from '../constants';
import { ThemeService } from '../services/theme-service';
import { LanguageService } from '../services/language-service';
import { TranslateService, Translation } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

interface AppState {
  theme: Theme;
  language: SupportedLanguages;
}

const initialState: AppState = {
  theme: Theme.LIGHT,
  language: SupportedLanguages.EN,
};

export const AppStore = signalStore(
  withState<AppState>(initialState),
  withMethods((store) => {
    const themeService = inject(ThemeService);
    const languageService = inject(LanguageService);
    const translate = inject(TranslateService);
    const primeng = inject(PrimeNG);

    return {
      setTheme(mode: Theme) {
        patchState(store, { theme: mode });
        themeService.saveToStorage(mode);
        themeService.applyToDom(mode);
      },
      setLanguage(lang: SupportedLanguages): Observable<unknown> {
        patchState(store, { language: lang });
        languageService.saveToStorage(lang);
        return translate.use(lang).pipe(
          switchMap(() => translate.get('primeng')),
          tap((res: Translation) => primeng.setTranslation(res)),
        );
      },
      initTheme() {
        const saved = themeService.getFromStorage();
        const mode =
          saved === Theme.DARK || saved === Theme.LIGHT ? saved : Theme.LIGHT;
        this.setTheme(mode);
      },
      initLanguageAsync(): Observable<Translation> {
        const saved = languageService.getFromStorage();
        const hadStored =
          saved && Object.values(SupportedLanguages).includes(saved as SupportedLanguages);
        const lang: SupportedLanguages = hadStored
          ? (saved as SupportedLanguages)
          : languageService.getSystemLanguage();
        return this.setLanguage(lang);
      },
      toggleTheme() {
        const mode =
          store.theme() === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        this.setTheme(mode);
      },
    };
  }),
);
