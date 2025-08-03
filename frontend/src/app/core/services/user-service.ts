import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/auth';
import { UserStore } from '../store/user.store';
import { MessageService } from 'primeng/api';

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
    this.userStore.setLoading(true);
    return this.get<User>('users/me?populate=role').pipe(
      tap((user) => {
        this.userStore.setUser(user);
      }),
      catchError(() => {
        return of(null);
      }),
      finalize(() => {
        this.userStore.setLoading(false);
      }),
    );
  }

  editUserData(
    user: Pick<User, 'id' | 'firstName' | 'lastName'>,
  ): Observable<User> {
    return this.put<User>(`users/${user.id}`, user).pipe(
      tap((user) => {
        this.userStore.setUser(user);
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
}
