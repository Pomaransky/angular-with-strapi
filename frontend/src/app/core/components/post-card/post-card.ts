import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Avatar } from '../avatar/avatar';
import { RichTextToPlainPipe } from '../../pipes/rich-text-to-plain.pipe';
import { Post } from '../../models';

@Component({
  selector: 'app-post-card',
  imports: [
    DatePipe,
    NgTemplateOutlet,
    RouterLink,
    CardModule,
    Avatar,
    RichTextToPlainPipe,
  ],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCard {
  @Input({ required: true }) post!: Post;
  @Input() link = false;
  @Input() clipContent = false;
}
