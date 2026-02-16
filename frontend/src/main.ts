import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Theme, THEME_STORAGE_KEY } from './app/core/constants';

function applyThemeBeforeBootstrap(): void {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const html = document.documentElement;
  if (stored === Theme.DARK) {
    html.classList.add('dark');
    document.body.setAttribute('data-theme', 'dark');
  } else {
    html.classList.remove('dark');
    document.body.setAttribute('data-theme', 'light');
  }
}
applyThemeBeforeBootstrap();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
