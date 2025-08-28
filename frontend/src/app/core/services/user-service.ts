import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { UserStore } from '../store/user.store';
import { MessageService } from 'primeng/api';
import { Paginated, UserData, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private userStore = inject(UserStore);
  private messageService = inject(MessageService);

  constructor(http: HttpClient) {
    super(http);
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

  editUserData(
    user: Pick<User, 'id' | 'firstName' | 'lastName'>,
  ): Observable<User> {
    return this.put<User>(`users/${user.id}`, user).pipe(
      tap((user) => {
        this.userStore.setMe(user);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User data updated successfully',
        });
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.error.message,
        });
        return throwError(() => new Error(error.error.error.message));
      }),
    );
  }

  // Pagination is not working for users-permissions (api/users) plugin in Strapi: https://github.com/strapi/strapi/issues/12911
  // Created UserData model to get users where pagination is working
  getUsers(page: number, pageSize: number): Observable<Paginated<UserData>> {
    this.userStore.setUsersLoading(true);
    return this.get<Paginated<UserData>>(
      `users-data?populate=user.role&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[user][role][type][$eq]=authenticated&fields=id`,
    ).pipe(
      tap((users) => {
        this.userStore.setUsers(users);
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users',
        });
        return throwError(() => new Error('Failed to fetch users'));
      }),
      finalize(() => {
        this.userStore.setUsersLoading(false);
      }),
    );
  }

  getUser(id: string): Observable<User> {
    return this.get<User>(`users/${id}?populate=userDetails`).pipe(
      tap((user) => {
        console.log(user);
      }),
    );
  }

  updateUserBlockStatus(userId: string, blocked: boolean): Observable<User> {
    return this.put<User>(`users/${userId}`, { blocked }).pipe(
      tap((user) => {
        this.userStore.updateUser(Number(userId), { blocked: user.blocked });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${blocked ? 'blocked' : 'unblocked'} successfully`,
        });
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error?.error?.message || 'Failed to update user block status',
        });
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
