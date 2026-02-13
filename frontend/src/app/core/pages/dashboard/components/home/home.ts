import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserStore } from '../../../../store/user.store';
import { PostApi } from '../../../../services/post-api';
import { ButtonModule } from 'primeng/button';
import { PostForm, PostsList } from '../../../../components';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, PostForm, PostsList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private postService = inject(PostApi);
  private userStore = inject(UserStore);
  private destroyRef = inject(DestroyRef);

  postFormRef = viewChild.required(PostForm);

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
