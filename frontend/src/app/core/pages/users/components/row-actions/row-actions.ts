import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { UserData } from '../../../../models';
import { UserService } from '../../../../services/user-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-row-actions',
  imports: [ButtonModule, Menu],
  templateUrl: './row-actions.html',
  styleUrl: './row-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActions implements OnInit {
  @Input({ required: true }) userData!: UserData;
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  rowActions: MenuItem[] | undefined;

  ngOnInit(): void {
    this.rowActions = [
      {
        label: 'Block',
        icon: 'pi pi-lock',
        disabled: this.userData.user.blocked,
        command: () => {
          this.updateUserBlockStatus(true);
        },
      },
      {
        label: 'Unblock',
        icon: 'pi pi-unlock',
        disabled: !this.userData.user.blocked,
        command: () => {
          this.updateUserBlockStatus(false);
        },
      },
    ];
  }

  updateUserBlockStatus(status: boolean): void {
    this.userService
      .updateUserBlockStatus(this.userData.user.id.toString(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
