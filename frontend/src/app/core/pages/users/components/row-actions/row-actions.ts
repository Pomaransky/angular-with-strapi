import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { User } from '../../../../models/auth';
import { UserApiService } from '../../../../services/user-api-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsDialog } from '..';

@Component({
  selector: 'app-row-actions',
  imports: [ButtonModule, Menu, DetailsDialog],
  templateUrl: './row-actions.html',
  styleUrl: './row-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActions implements OnInit {
  @Input({ required: true }) user!: User;
  private userApiService = inject(UserApiService);
  private destroyRef = inject(DestroyRef);
  rowActions: MenuItem[] | undefined;

  @ViewChild(DetailsDialog) detailsDialog!: DetailsDialog;

  ngOnInit(): void {
    this.rowActions = [
      {
        label: 'Block',
        icon: 'pi pi-lock',
        disabled: this.user.blocked,
        command: () => {
          this.updateUserBlockStatus(true);
        },
      },
      {
        label: 'Unblock',
        icon: 'pi pi-unlock',
        disabled: !this.user.blocked,
        command: () => {
          this.updateUserBlockStatus(false);
        },
      },
      {
        label: 'Details',
        icon: 'pi pi-info-circle',
        command: () => {
          this.detailsDialog.showDialog(this.user.id);
        },
      },
    ];
  }

  updateUserBlockStatus(status: boolean): void {
    this.userApiService
      .updateUserBlockStatus(this.user.id.toString(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
