import { Injectable, signal } from '@angular/core';
import { Theme, THEME_STORAGE_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _themeMode = signal<Theme>(Theme.LIGHT);
  private doc = typeof document !== 'undefined' ? document : null;

  readonly themeMode = this._themeMode.asReadonly();

  getTheme(): Theme {
    return this._themeMode();
  }

  setTheme(mode: Theme): void {
    this._themeMode.set(mode);
    this.setThemeToLocalStorage(mode);
    this.applyToDom(mode);
  }

  toggle(): void {
    this.setTheme(this.getTheme() === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  }

  init(): void {
    if (!this.doc) return;
    const saved = this.readThemeFromLocalStorage();
    const mode: Theme = saved === Theme.DARK || saved === Theme.LIGHT ? saved : Theme.LIGHT;
    this.applyToDom(mode);
    this._themeMode.set(mode);
  }

  private applyToDom(mode: Theme): void {
    if (!this.doc) return;
    const html = this.doc.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  private setThemeToLocalStorage(mode: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  private readThemeFromLocalStorage(): Theme | null {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === Theme.DARK || theme === Theme.LIGHT ? theme : null;
  }
}
