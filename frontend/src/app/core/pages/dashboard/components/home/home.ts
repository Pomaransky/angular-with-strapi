import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post, TableLoadParams } from '../../../../models';
import { DeepSignal } from '@ngrx/signals';
import { PostsStore } from '../../../../store/posts.store';
import { PostApi } from '../../../../services/post-api';
import { UserStore } from '../../../../store/user.store';
import { ButtonModule } from 'primeng/button';
import { PostForm, PostCard } from '../../../../components';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InfiniteScrollDirective } from '../../../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    ProgressSpinnerModule,
    InfiniteScrollDirective,
    PostForm,
    PostCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private postService = inject(PostApi);
  private postStore = inject(PostsStore);
  private userStore = inject(UserStore);
  private destroyRef = inject(DestroyRef);

  postFormRef = viewChild.required(PostForm);

  postsData: DeepSignal<Post[]> = this.postStore.posts.data.data;
  totalRecords: DeepSignal<number> =
    this.postStore.posts.data.meta.pagination.total;
  isPostsLoading: DeepSignal<boolean> = this.postStore.posts.isLoading;

  get hasMorePosts(): boolean {
    const { page, pageCount, total } =
      this.postStore.posts().data.meta.pagination;
    return page < pageCount && total > 0;
  }

  ngOnInit(): void {
    this.onPostsLoad(this.postStore.posts.lastLoadParams());
  }

  onInfiniteScroll(): void {
    if (this.hasMorePosts && !this.isPostsLoading()) {
      this.loadMore();
    }
  }

  onPostsLoad(params: TableLoadParams): void {
    this.postService.getPosts(params, true).subscribe();
  }

  loadMore(): void {
    if (!this.hasMorePosts || this.isPostsLoading()) return;
    const params = this.postStore.posts.lastLoadParams();
    this.postService
      .getPosts({ ...params, page: params.page + 1 }, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onPostSubmit(payload: { content: string; parentDocumentId?: string }): void {
    const user = this.userStore.me.data();
    if (!user) return;
    this.postService
      .addPost(payload.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.postFormRef().reset(),
      });
  }
}
