import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { User } from '../models/auth';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private userStore = inject(UserStore);
  constructor(http: HttpClient) {
    super(http);
  }

  getMe(): Observable<User | null> {
    this.userStore.setLoading(true);
    return this.get<User>('users/me').pipe(
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
}
