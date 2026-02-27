import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Avatar } from '../avatar/avatar';
import { RichTextToPlainPipe } from '../../pipes/rich-text-to-plain.pipe';
import { DateFromNowPipe } from '../../pipes/from-now.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { Post } from '../../models';
import { PostsStore } from '../../store/posts.store';

@Component({
  selector: 'app-post-card',
  imports: [
    DatePipe,
    DateFromNowPipe,
    NgTemplateOutlet,
    CardModule,
    Avatar,
    RichTextToPlainPipe,
    TooltipModule,
  ],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCard {
  private router = inject(Router);
  private postsStore = inject(PostsStore);

  @Input({ required: true }) post!: Post;
  @Input() link = false;
  @Input() isMainPost = false;

  navigateToPost(post: Post): void {
    this.postsStore.setCurrentPost(post);
    this.router.navigate(['/post', post.documentId]);
  }
}
