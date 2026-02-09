import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { Post as PostModel } from '../models';
import { PostApi } from '../services/post-api';
import { PostsStore } from '../store/posts.store';

export const postResolver: ResolveFn<PostModel> = (route) => {
  const documentId = route.paramMap.get('id');
  const router = inject(Router);
  const postApi = inject(PostApi);
  const postsStore = inject(PostsStore);
  if (!documentId) {
    postsStore.setCurrentPost(null);
    router.navigate(['/']);
    return EMPTY;
  }
  return postApi.getPost(documentId).pipe(
    tap((post) => postsStore.setCurrentPost(post)),
    catchError(() => {
      postsStore.setCurrentPost(null);
      router.navigate(['/']);
      return EMPTY;
    }),
  );
};
