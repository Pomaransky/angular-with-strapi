import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user-service';
import { UserStore } from '../../store/user.store';
import { Spinner } from '../../components';
import { ButtonModule } from 'primeng/button';
import { DataRow } from './components/data-row/data-row';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';

@Component({
  selector: 'app-profile',
  imports: [Spinner, ButtonModule, DataRow, EditProfileDialog],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  user = computed(() => this.userStore.user());
  isLoading = computed(() => this.userStore.isLoading());

  @ViewChild(EditProfileDialog) editProfileDialog!: EditProfileDialog;

  ngOnInit(): void {
    if (!this.user()) {
      this.getMe();
    }
  }

  getMe(): void {
    this.userService.getMe().subscribe();
  }

  onEdit(): void {
    this.editProfileDialog.showDialog();
  }
}
