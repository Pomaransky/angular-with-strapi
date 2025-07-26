import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:1337'; // TODO: Use environment variables

  constructor(private http: HttpClient) { }

  getContentType(contentType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/${contentType}`);
  }

  getSingleItem(contentType: string, id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/${contentType}/${id}`);
  }

  createItem(contentType: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/${contentType}`, { data });
  }

  updateItem(contentType: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/${contentType}/${id}`, { data });
  }

  deleteItem(contentType: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/${contentType}/${id}`);
  }
}
