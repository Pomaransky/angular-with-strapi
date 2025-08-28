import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { UserApiService } from '../services/user-api-service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UserRoleType } from '../models/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const userApiService = inject(UserApiService);
  const router = inject(Router);

  const user = userStore.me.data();

  if (!user) {
    return userApiService.getMe().pipe(
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
