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
import { AppStore } from './core/store/app.store';
import { pulsarThemePreset, SupportedLanguages } from './core/constants';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => {
      const appStore = inject(AppStore);
      appStore.initTheme();
      return appStore.initLanguageAsync();
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    UserStore,
    PostsStore,
    AppStore,
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
    provideTranslateService({
      fallbackLang: SupportedLanguages.EN,
      lang: SupportedLanguages.EN,
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
    }),
    ConfirmationService,
    MessageService,
  ],
};
