import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UserRoleType } from '../models/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userStore.user();

  if (!user) {
    return userService.getMe().pipe(
      map((user) => {
        if (!user || user.role?.type !== UserRoleType.ADMIN) {
          router.navigate(['/']);
          return false;
        }
        return true;
      }),
    );
  }

  if (user.role?.type !== UserRoleType.ADMIN) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
