import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map, of } from 'rxjs';
import { ApiService } from './api-service';
import {
  LoginCredentials,
  AuthResponse,
  RegisterCredentials,
} from '../models/auth';
import { UserStore } from '../store/user.store';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  private userStore = inject(UserStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor(http: HttpClient) {
    super(http);
    this.checkExistingToken();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.post<AuthResponse>('auth/local', credentials).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('jwt_token', response.jwt);
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        return throwError(() => new Error(error.error.error.message));
      }),
    );
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.post<AuthResponse>('auth/local/register', credentials).pipe(
      tap((response: AuthResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully registered ${response.user.username}, please login to continue`,
        });
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        return throwError(() => new Error(error.error.error.message));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.userStore.setMe(null);
    this.router.navigate(['/login']);
  }

  getAuthState(): Observable<boolean> {
    const token = this.getToken();

    if (token && this.isTokenValid(token)) {
      return of(true);
    }

    if (token) {
      this.logout();
    }
    return of(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private checkExistingToken(): void {
    const token = this.getToken();
    if (token && !this.isTokenValid(token)) {
      this.logout();
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      // Decode the JWT token (base64 decode the payload)
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedPayload.exp && decodedPayload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}
