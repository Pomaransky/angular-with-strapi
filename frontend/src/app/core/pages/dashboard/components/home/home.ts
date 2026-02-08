import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post, RichTextContent, TableLoadParams } from '../../../../models';
import { DeepSignal } from '@ngrx/signals';
import { PostsStore } from '../../../../store/posts.store';
import { PostApi } from '../../../../services/post-api';
import { CardModule } from 'primeng/card';
import { RichTextToPlainPipe } from '../../../../pipes/rich-text-to-plain.pipe';
import { DatePipe } from '@angular/common';
import { UserStore } from '../../../../store/user.store';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar, InputField } from '../../../../components';
import { ValidationMessage } from '../../../../models';
import { POST_VALIDATION_MESSAGES } from '../../constants/post-validation-messages.const';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InfiniteScrollDirective } from '../../../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputField,
    ProgressSpinnerModule,
    InfiniteScrollDirective,
    Avatar,
  ],
  providers: [RichTextToPlainPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private postService = inject(PostApi);
  private postStore = inject(PostsStore);
  private richTextToPlainPipe = inject(RichTextToPlainPipe);
  private userStore = inject(UserStore);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  postForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(255)]],
  });

  postValidationMessages: ValidationMessage[] = POST_VALIDATION_MESSAGES;

  postsData: DeepSignal<Post[]> = this.postStore.posts.data.data;
  totalRecords: DeepSignal<number> = this.postStore.posts.data.meta.pagination.total;
  isPostsLoading: DeepSignal<boolean> = this.postStore.posts.isLoading;

  get hasMorePosts(): boolean {
    const { page, pageCount, total } = this.postStore.posts().data.meta.pagination;
    return page < pageCount && total > 0;
  }

  getPostContent(content: RichTextContent | string): string {
    return typeof content === 'string' ? content : this.richTextToPlainPipe.transform(content);
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
    this.postService.getPosts(params).subscribe();
  }

  loadMore(): void {
    if (!this.hasMorePosts || this.isPostsLoading()) return;
    const params = this.postStore.posts.lastLoadParams();
    this.postService
      .getPosts({ ...params, page: params.page + 1 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  addPost(): void {
    const trimmed = this.postForm.get('content')?.value?.trim();
    if (!trimmed) return;

    const user = this.userStore.me.data();
    if (user) {
      this.postService.addPost(trimmed).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.postForm.reset(),
      });
    }
  }
}
