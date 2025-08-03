import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { UserStore } from '../../store/user.store';
import { Spinner } from '../../components';
import { ButtonModule } from 'primeng/button';
import { DataRow } from './components/data-row/data-row';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { DeepSignal } from '@ngrx/signals';
import { User } from '../../models/auth/user.model';

@Component({
  selector: 'app-profile',
  imports: [Spinner, ButtonModule, DataRow, EditProfileDialog],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private userStore = inject(UserStore);
  user: DeepSignal<User | null> = this.userStore.user;
  isUserLoading: DeepSignal<boolean> = this.userStore.isLoading;

  @ViewChild(EditProfileDialog) editProfileDialog!: EditProfileDialog;

  onEdit(): void {
    this.editProfileDialog.showDialog();
  }
}
