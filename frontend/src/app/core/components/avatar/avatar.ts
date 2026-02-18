import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  @Input() userData: User | null = null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  get defaultData(): string {
    if (!this.userData) return '';
    return this.userData.firstName && this.userData.lastName
      ? this.userData.firstName.charAt(0) + this.userData.lastName.charAt(0)
      : this.userData.username.charAt(0);
  }

  get url(): string | null {
    return this.userData?.avatar?.formats?.thumbnail?.url ? `${environment.apiUrl}${this.userData.avatar.formats.thumbnail.url}` : null;
  }

  get boxSize(): string {
    switch (this.size) {
      case 'sm':
        return '2rem';
      case 'md':
        return '3rem';
      case 'lg':
        return '4rem';
    }
  }

  get fontSize(): string {
    switch (this.size) {
      case 'sm':
        return '0.75rem';
      case 'md':
        return '1.25rem';
      case 'lg':
        return '1.5rem';
    }
  }
}
