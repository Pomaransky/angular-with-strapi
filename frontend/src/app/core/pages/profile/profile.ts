import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { UserStore } from '../../store/user.store';
import { Spinner, DataRow } from '../../components';
import { ButtonModule } from 'primeng/button';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { DeepSignal } from '@ngrx/signals';
import { User } from '../../models/auth/user.model';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-profile',
  imports: [Spinner, ButtonModule, DataRow, EditProfileDialog, DatePipe, CardModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private userStore = inject(UserStore);
  user: DeepSignal<User | null> = this.userStore.me.data;
  isUserLoading: DeepSignal<boolean> = this.userStore.me.isLoading;

  @ViewChild(EditProfileDialog) editProfileDialog!: EditProfileDialog;

  onEdit(): void {
    this.editProfileDialog.showDialog();
  }
}
