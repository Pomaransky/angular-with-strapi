import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import {
  catchError,
  finalize,
  map,
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
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

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
        this.toastService.successToast(
          this.translate.instant('user.userDataUpdated'),
        );
      }),
      switchMap(() => this.getMe()),
      catchError((error) => {
        const msg =
          error.error?.error?.message ??
          this.translate.instant('user.userDataUpdateError');
        this.toastService.errorToast(msg);
        return throwError(() => new Error(msg));
      }),
    );
  }

  getUsers(params: TableLoadParams): Observable<Paginated<User>> {
    const { page, pageSize } = params;
    this.userStore.setUsersLoadParams(params);
    this.userStore.setUsersLoading(true);
    const { sort, filter } = tableLoadParamsToStrapiQuery(params);
    const base = `users?populate=role&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[role][type][$eq]=authenticated`;
    const url = `${base}${sort}${filter}`;
    return this.get<Paginated<User>>(url).pipe(
      tap((users) => {
        this.userStore.setUsers(users);
      }),
      catchError(() => {
        const msg = this.translate.instant('user.usersFetchError');
        this.toastService.errorToast(msg);
        return throwError(() => new Error(msg));
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
      tap(() => {
        this.toastService.successToast(
          this.translate.instant(
            blocked ? 'user.userBlocked' : 'user.userUnblocked',
          ),
        );
      }),
      switchMap((user) => {
        const params = this.userStore.users().lastLoadParams;
        return params ? this.getUsers(params).pipe(map(() => user)) : of(user);
      }),
      catchError((error) => {
        const msg =
          error.error?.error?.message ||
          this.translate.instant('user.updateBlockStatusError');
        this.toastService.errorToast(msg);
        return throwError(() => new Error(msg));
      }),
    );
  }
}
