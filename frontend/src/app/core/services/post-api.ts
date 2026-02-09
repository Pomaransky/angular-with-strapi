import { inject, Injectable } from '@angular/core';
import { Paginated, Post, TableLoadParams } from '../models';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { tableLoadParamsToStrapiQuery } from '../utils/table-load-params-to-query';
import { ApiService } from './api-service';
import { PostsStore } from '../store/posts.store';
import { ToastService } from './toast-service';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class PostApi extends ApiService {
  private postsStore = inject(PostsStore);
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);

  constructor() {
    super();
  }

  getPost(documentId: string): Observable<Post> {
    return this.get<{ data: Post }>(`posts/${documentId}?populate=author`).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Failed to fetch post'))),
    );
  }

  getPosts(params: TableLoadParams): Observable<Paginated<Post>> {
    const { page, pageSize } = params;
    this.postsStore.setPostsLoading(true);
    const { sort, filter } = tableLoadParamsToStrapiQuery(params);
    const base = `posts?populate=author&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const url = `${base}${sort}${filter}`;
    return this.get<Paginated<Post>>(url).pipe(
      tap((posts) => this.postsStore.addPosts(posts)),
      catchError(() => {
        return throwError(() => new Error('Failed to fetch posts'));
      }),
      finalize(() => this.postsStore.setPostsLoading(false)),
    );
  }

  addPost(postContent: string): Observable<Post> {
    const user = this.userStore.me.data();
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { documentId: _, role: __, ...author } = user;
    return this.post<{ data: Post }>('posts?populate=author', {
      data: {
        content: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: postContent }],
          },
        ],
        author,
      },
    }).pipe(
      tap((res) => {
        this.postsStore.prependPost(res.data);
        this.toastService.successToast(`Post added successfully`);
      }),
      map((res) => res.data),
      catchError((error) => {
        this.toastService.errorToast(
          error.error?.error?.message || 'Failed to add post',
        );
        return throwError(
          () => new Error(error.error?.error?.message || 'Failed to add post'),
        );
      }),
    );
  }
}
