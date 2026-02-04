import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import {
  catchError,
  finalize,
  Observable,
  of,
  tap,
  throwError,
  switchMap,
} from 'rxjs';
import { UserStore } from '../store/user.store';
import { Paginated, TableLoadParams, User } from '../models';
import { ToastService } from './toast-service';
import { tableLoadParamsToStrapiQuery } from '../utils/table-load-params-to-query';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);

  constructor() {
    super();
  }

  getMe(): Observable<User | null> {
    this.userStore.setMeLoading(true);
    return this.get<User>('users/me?populate=role').pipe(
      tap((user) => {
        this.userStore.setMe(user);
      }),
      catchError(() => {
        return of(null);
      }),
      finalize(() => {
        this.userStore.setMeLoading(false);
      }),
    );
  }

  editMe(
    user: Pick<User, 'id' | 'firstName' | 'lastName' | 'birthDate' | 'aboutMe'>,
  ): Observable<User | null> {
    return this.put<User>(`user/me`, user).pipe(
      tap(() => {
        this.toastService.successToast('User data updated successfully');
      }),
      switchMap(() => this.getMe()),
      catchError((error) => {
        this.toastService.errorToast(error.error.error.message);
        return throwError(() => new Error(error.error.error.message));
      }),
    );
  }

  getUsers(params: TableLoadParams): Observable<Paginated<User>> {
    const { page, pageSize } = params;
    this.userStore.setUsersLoading(true);
    const { sort, filter } = tableLoadParamsToStrapiQuery(params);
    const base = `users?populate=role&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[role][type][$eq]=authenticated`;
    const url = `${base}${sort}${filter}`;
    return this.get<Paginated<User>>(url).pipe(
      tap((users) => {
        this.userStore.setUsers(users);
      }),
      catchError(() => {
        this.toastService.errorToast('Failed to fetch users');
        return throwError(() => new Error('Failed to fetch users'));
      }),
      finalize(() => {
        this.userStore.setUsersLoading(false);
      }),
    );
  }

  getUser(id: string): Observable<User> {
    return this.get<User>(`users/${id}?populate=role`);
  }

  updateUserBlockStatus(userId: string, blocked: boolean): Observable<User> {
    return this.put<User>(`users/${userId}`, { blocked }).pipe(
      tap((user) => {
        this.userStore.updateUser(Number(userId), { blocked: user.blocked });
        this.toastService.successToast(`User ${blocked ? 'blocked' : 'unblocked'} successfully`);
      }),
      catchError((error) => {
        this.toastService.errorToast(error.error?.error?.message || 'Failed to update user block status');
        return throwError(
          () =>
            new Error(
              error.error?.error?.message ||
              'Failed to update user block status',
            ),
        );
      }),
    );
  }
}
