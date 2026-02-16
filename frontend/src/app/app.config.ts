import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';

import { routes } from './app.routes';
import { UserStore } from './core/store/user.store';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PostsStore } from './core/store/posts.store';
import { ThemeService } from './core/services/theme-service';
import { pulsarThemePreset } from './core/constants';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      inject(ThemeService).init();
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    UserStore,
    PostsStore,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: pulsarThemePreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, components, primeng, utilities',
          },
          darkModeSelector: '.dark',
        },
      },
    }),
    ConfirmationService,
    MessageService,
  ],
};
