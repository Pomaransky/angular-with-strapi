import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  @Input({ required: true }) userData!: User;
  @Input() size = 20;

  get defaultData(): string {
    return this.userData.firstName && this.userData.lastName
      ? this.userData.firstName.charAt(0) + this.userData.lastName.charAt(0)
      : this.userData.username.charAt(0);
  }

  get fontSize(): string {
    return `${this.size * 1.5}px`;
  }
}
