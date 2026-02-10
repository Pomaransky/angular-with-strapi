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
    return this.get<{ data: Post }>(
      `posts/${documentId}?populate=author&populate=comments.author`,
    ).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Failed to fetch post'))),
    );
  }

  getPosts(
    params: TableLoadParams,
    rootOnly = false,
  ): Observable<Paginated<Post>> {
    const { page, pageSize } = params;
    this.postsStore.setPostsLoading(true);
    const { sort, filter } = tableLoadParamsToStrapiQuery(params);
    const rootOnlyFilter = rootOnly ? '&filters[parent][$null]=true' : '';
    const base = `posts?populate=author&populate=comments&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const url = `${base}${sort}${filter}${rootOnlyFilter}`;
    return this.get<Paginated<Post>>(url).pipe(
      tap((posts) => this.postsStore.addPosts(posts)),
      catchError(() => {
        return throwError(() => new Error('Failed to fetch posts'));
      }),
      finalize(() => this.postsStore.setPostsLoading(false)),
    );
  }

  addPost(postContent: string, parentDocumentId?: string): Observable<Post> {
    const user = this.userStore.me.data();
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { documentId: _, role: __, ...author } = user;
    const data: Record<string, unknown> = {
      content: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: postContent }],
        },
      ],
      author,
    };
    if (parentDocumentId) {
      data['parent'] = parentDocumentId;
    }
    const isComment = !!parentDocumentId;
    return this.post<{ data: Post }>('posts?populate=author', { data }).pipe(
      map((res) => res.data),
      tap((post) => {
        if (isComment) {
          this.postsStore.appendCommentToCurrentPost(post);
          this.toastService.successToast('Comment added');
        } else {
          this.postsStore.prependPost(post);
          this.toastService.successToast('Post added successfully');
        }
      }),
      catchError((error) => {
        const msg =
          error.error?.error?.message ||
          (isComment ? 'Failed to add comment' : 'Failed to add post');
        this.toastService.errorToast(msg);
        return throwError(() => new Error(msg));
      }),
    );
  }
}
