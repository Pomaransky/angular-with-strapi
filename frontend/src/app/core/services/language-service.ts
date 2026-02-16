import { Injectable } from '@angular/core';
import { LANGUAGE_STORAGE_KEY, SupportedLanguages } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  getFromStorage(): string | null {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  }

  saveToStorage(lang: SupportedLanguages): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  getSystemLanguage(): SupportedLanguages {
    const systemLanguage = navigator.language?.split('-')[0]?.toLowerCase();
    return systemLanguage &&
      Object.values(SupportedLanguages).includes(
        systemLanguage as SupportedLanguages,
      )
      ? (systemLanguage as SupportedLanguages)
      : SupportedLanguages.EN;
  }
}
