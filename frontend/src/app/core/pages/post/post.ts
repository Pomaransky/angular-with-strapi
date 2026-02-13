import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostForm, PostCard, type PostFormSubmit, PostsList } from '../../components';
import { PostsStore } from '../../store/posts.store';
import { PostApi } from '../../services/post-api';

@Component({
  selector: 'app-post',
  imports: [PostForm, PostCard, PostsList],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Post {
  private postsStore = inject(PostsStore);
  private postApi = inject(PostApi);
  private destroyRef = inject(DestroyRef);

  post = this.postsStore.currentPost;

  showCommentForm = signal(false);
  commentFormRef = viewChild<PostForm>('commentFormRef');

  toggleCommentForm(): void {
    this.showCommentForm.update((v) => !v);
  }

  onCommentSubmit(payload: PostFormSubmit): void {
    if (!payload.parentDocumentId) return;
    this.postApi
      .addPost(payload.content, payload.parentDocumentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.commentFormRef()?.reset();
          this.showCommentForm.set(false);
        },
      });
  }
}
