import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/api/${url}`);
  }

  post<T>(url: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/api/${url}`, data);
  }

  put<T>(url: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/api/${url}`, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/api/${url}`);
  }
}
