import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAuthState().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    }),
  );
};
