import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';
import { Media } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FileApiService extends ApiService {
  constructor() {
    super();
  }

  uploadFile(
    file: File,
    ref: string,
    refId: number,
    field: string,
  ): Observable<Media> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', ref);
    formData.append('refId', String(refId));
    formData.append('field', field);
    return this.post<Media>('upload', formData);
  }

  deleteFile(fileId: string): Observable<Media> {
    return this.delete<Media>(`upload/files/${fileId}`);
  }
}
