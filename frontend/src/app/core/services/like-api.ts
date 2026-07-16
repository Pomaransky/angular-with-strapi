import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LikeToggleResponse } from '../models/posts/like.model';
import { ApiService } from './api-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LikeApi extends ApiService {
  private translate = inject(TranslateService);

  toggleLike(postDocumentId: string): Observable<LikeToggleResponse> {
    return this.post<{ data: LikeToggleResponse }>('likes/toggle', {
      postDocumentId,
    }).pipe(
      map((res) => res.data),
      catchError((error) =>
        throwError(
          () =>
            new Error(
              error?.error?.message ||
                this.translate.instant('posts.likeToggleError'),
            ),
        ),
      ),
    );
  }
}
