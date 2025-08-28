import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeepSignal } from '@ngrx/signals';
import { UserStore } from '../../store/user.store';
import { UserService } from '../../services/user-service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UserData } from '../../models';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RowActions } from './components';

@Component({
  selector: 'app-users',
  imports: [TableModule, DatePipe, TagModule, RowActions],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private userService = inject(UserService);
  private userStore = inject(UserStore);

  usersData: DeepSignal<UserData[]> = this.userStore.users.data.data;
  totalRecords: DeepSignal<number> =
    this.userStore.users.data.meta.pagination.total;
  pageSize = 5;
  isUsersLoading: DeepSignal<boolean> = this.userStore.users.isLoading;

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page =
      event.first && event.rows ? Math.floor(event.first / event.rows) + 1 : 1;
    this.userService.getUsers(page, this.pageSize).subscribe();
  }
}
