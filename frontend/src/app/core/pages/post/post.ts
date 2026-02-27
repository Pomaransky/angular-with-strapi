import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  PostForm,
  PostCard,
  type PostFormSubmit,
  PostsList,
  Spinner,
} from '../../components';
import type { Post as PostModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { PostsStore } from '../../store/posts.store';
import { PostApi } from '../../services/post-api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-post',
  imports: [PostForm, PostCard, PostsList, TranslateModule, ButtonModule, Spinner],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Post implements OnInit {
  private postsStore = inject(PostsStore);
  private postApi = inject(PostApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  post = this.postsStore.currentPost;
  isPostLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params) => params.get('id')!),
        switchMap((documentId) => {
          const current = this.postsStore.currentPost();
          if (current?.documentId === documentId) {
            this.isPostLoading.set(false);
            return of(current);
          }
          this.isPostLoading.set(true);

          return this.loadPost(documentId);
        }),
      )
      .subscribe();
  }

  private loadPost(documentId: string): Observable<PostModel> {
    return this.postApi.getPost(documentId).pipe(
      tap((post) => this.postsStore.setCurrentPost(post)),
      catchError(() => {
        this.postsStore.setCurrentPost(null);
        this.router.navigate(['/']);
        return EMPTY;
      }),
      finalize(() => this.isPostLoading.set(false)),
    );
  }

  showCommentForm = signal(false);
  commentFormRef = viewChild<PostForm>('commentFormRef');

  toggleCommentForm(): void {
    this.showCommentForm.update((v) => !v);
  }

  onCommentSubmit(payload: PostFormSubmit): void {
    if (!payload.parentDocumentId) return;
    this.postApi
      .addPost(payload.content, payload.parentDocumentId, payload.media)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.commentFormRef()?.reset();
          this.showCommentForm.set(false);
        },
      });
  }
}
