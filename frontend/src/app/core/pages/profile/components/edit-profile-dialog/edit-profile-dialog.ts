import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../../services/user-service';
import { UserStore } from '../../../../store/user.store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { DeepSignal } from '@ngrx/signals';
import { User } from '../../../../models/auth/user.model';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialog {
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  visible = signal<boolean>(false);
  user: DeepSignal<User | null> = this.userStore.me.data;
  editForm!: FormGroup;

  constructor() {
    effect(() => {
      if (this.user()) {
        this.initForm();
      }
    });
  }

  private initForm(): void {
    this.editForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });
  }

  showDialog(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.patchValue({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      });
    }
    this.visible.set(true);
  }

  onEdit(): void {
    const user = this.user();
    if (!user) {
      return;
    }

    this.userService
      .editUserData({
        id: user.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
      })
      .pipe(finalize(() => this.visible.set(false)))
      .subscribe();
  }
}
