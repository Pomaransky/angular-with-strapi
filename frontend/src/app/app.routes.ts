import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginGuard } from './core/guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./core/pages/dashboard/components/home/home').then(m => m.Home),
      },
      {
        path: 'profile',
        loadComponent: () => import('./core/pages/profile/profile').then(m => m.Profile),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/pages/login/login').then((m) => m.Login),
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/pages/register/register').then((m) => m.Register),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
