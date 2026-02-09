import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginGuard } from './core/guards/login-guard';
import { adminGuard } from './core/guards/admin-guard';
import { postResolver } from './core/resolvers/post.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./core/pages/dashboard/components/home/home').then(
            (m) => m.Home,
          ),
      },
      {
        path: 'post/:id',
        resolve: { post: postResolver },
        loadComponent: () =>
          import('./core/pages/post/post').then(
            (m) => m.Post,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./core/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./core/pages/users/users').then((m) => m.Users),
        canActivate: [adminGuard],
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
