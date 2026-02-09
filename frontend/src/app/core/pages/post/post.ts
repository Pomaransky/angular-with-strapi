import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Avatar } from '../../components';
import { RichTextToPlainPipe } from '../../pipes/rich-text-to-plain.pipe';
import { PostsStore } from '../../store/posts.store';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-post',
  imports: [DatePipe, Avatar, RichTextToPlainPipe, CardModule],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Post {
  private postsStore = inject(PostsStore);
  post = this.postsStore.currentPost;
}
