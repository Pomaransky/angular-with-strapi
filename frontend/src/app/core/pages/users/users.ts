import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeepSignal } from '@ngrx/signals';
import { UserStore } from '../../store/user.store';
import { UserService } from '../../services/user-service';
import { TableModule } from 'primeng/table';
import { UserData } from '../../models';

@Component({
  selector: 'app-users',
  imports: [TableModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Users {
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  usersData: DeepSignal<UserData[]> = this.userStore.users.data;
  isUsersLoading: DeepSignal<boolean> = this.userStore.users.isLoading;

  ngOnInit(): void {
    this.userService.getUsers().subscribe(); // TODO: Handle pagination
  }
}
