import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { DeepSignal } from '@ngrx/signals';
import { UserStore } from '../../store/user.store';
import { UserApiService } from '../../services/user-api-service';
import { TableModule } from 'primeng/table';
import { User, RowActionItem, TableLoadParams } from '../../models';
import { TagModule } from 'primeng/tag';
import { DetailsDialog } from './components';
import { Table } from '../../components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USERS_TABLE_CONFIG } from './constants/users-table-config.const';

@Component({
  selector: 'app-users',
  imports: [TableModule, TagModule, Table, DetailsDialog],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  @ViewChild(DetailsDialog) detailsDialog!: DetailsDialog;

  private userService = inject(UserApiService);
  private userStore = inject(UserStore);
  private destroyRef = inject(DestroyRef);

  usersTableConfig = USERS_TABLE_CONFIG;

  usersData: DeepSignal<User[]> = this.userStore.users.data.data;
  totalRecords: DeepSignal<number> =
    this.userStore.users.data.meta.pagination.total;
  isUsersLoading: DeepSignal<boolean> = this.userStore.users.isLoading;

  onTableLoad(params: TableLoadParams): void {
    this.userService
      .getUsers(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  rowActions(user: User): RowActionItem[] {
    return [
      {
        label: 'Block',
        icon: 'pi pi-lock',
        disabled: user.blocked,
        actionId: 'block',
      },
      {
        label: 'Unblock',
        icon: 'pi pi-unlock',
        disabled: !user.blocked,
        actionId: 'unblock',
      },
      {
        label: 'Details',
        icon: 'pi pi-info-circle',
        actionId: 'details',
      },
    ];
  }

  onRowAction(user: User, actionId: string): void {
    switch (actionId) {
      case 'block':
        this.updateUserBlockStatus(user, true);
        break;
      case 'unblock':
        this.updateUserBlockStatus(user, false);
        break;
      case 'details':
        this.detailsDialog.showDialog(user.id);
        break;
    }
  }

  private updateUserBlockStatus(user: User, status: boolean): void {
    this.userService
      .updateUserBlockStatus(user.id.toString(), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}