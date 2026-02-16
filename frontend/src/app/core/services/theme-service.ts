import { Injectable } from '@angular/core';
import { Theme, THEME_STORAGE_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  getFromStorage(): Theme | null {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === Theme.DARK || theme === Theme.LIGHT ? theme : null;
  }

  saveToStorage(mode: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  applyToDom(mode: Theme): void {
    const html = document.documentElement;
    if (mode === Theme.DARK) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
