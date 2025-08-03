import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar, Header } from './components';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { UserStore } from '../../store/user.store';
import { DeepSignal } from '@ngrx/signals';
import { UserService } from '../../services/user-service';
import { User } from '../../models/auth/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar, Header, ConfirmDialog],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class Dashboard {
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  user: DeepSignal<User | null> = this.userStore.user;

  ngOnInit(): void {
    if (!this.user()) {
      this.getMe();
    }
  }

  getMe(): void {
    this.userService.getMe().subscribe();
  }
}
