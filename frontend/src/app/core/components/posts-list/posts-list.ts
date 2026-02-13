import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post, TableLoadParams } from '../../models';
import { PostsStore } from '../../store/posts.store';
import { PostApi } from '../../services/post-api';
import { PostCard } from '../post-card/post-card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';
import { tap } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  imports: [PostCard, ProgressSpinnerModule, InfiniteScrollDirective],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsList implements OnInit, OnDestroy {
  @Input() parentDocumentId: string | undefined = undefined;
  private postStore = inject(PostsStore);
  private postApi = inject(PostApi);
  private destroyRef = inject(DestroyRef);

  postsData = this.postStore.posts.data.data;
  isPostsLoading = this.postStore.posts.isLoading;

  hasMorePosts(): boolean {
    const pagination = this.postStore.posts().data.meta.pagination;
    return pagination.page < pagination.pageCount && pagination.total > 0;
  }

  ngOnInit(): void {
    if(!this.parentDocumentId) {
      this.loadPosts(this.postStore.posts.lastLoadParams());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentDocumentId']) {
      this.postStore.resetPostsLoadParams();
      this.loadPosts(this.postStore.posts.lastLoadParams());
    }
  }

  onInfiniteScroll(): void {
    if (this.hasMorePosts() && !this.isPostsLoading()) {
      this.loadMore();
    }
  }

  private loadPosts(params: TableLoadParams): void {
    console.log('loadPosts', params, this.parentDocumentId);
    this.postApi.getPosts(params, this.parentDocumentId).pipe(takeUntilDestroyed(this.destroyRef), tap((posts) =>
      this.postStore.setPosts(posts)
    )).subscribe();
  }

  private loadMore(): void {
    if (!this.hasMorePosts() || this.isPostsLoading()) return;
    const params = this.postStore.posts.lastLoadParams();
    this.postApi
      .getPosts({ ...params, page: params.page + 1 }, this.parentDocumentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.postStore.resetPostsLoadParams();
  }
}
