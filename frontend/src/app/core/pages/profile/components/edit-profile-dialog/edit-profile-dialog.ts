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
import { UserApiService } from '../../../../services/user-api-service';
import { UserStore } from '../../../../store/user.store';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DeepSignal } from '@ngrx/signals';
import { User } from '../../../../models/auth/user.model';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule, TextareaModule],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialog {
  private userApiService = inject(UserApiService);
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
      birthDate: new FormControl(''),
      aboutMe: new FormControl('', [Validators.maxLength(255)]),
    });
  }

  showDialog(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.editForm.patchValue({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        birthDate: currentUser.birthDate || '',
        aboutMe: currentUser.aboutMe || '',
      });
    }
    this.visible.set(true);
  }

  onEdit(): void {
    const user = this.user();
    if (!user) {
      return;
    }

    this.userApiService
      .editMe({
        id: user.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        birthDate: this.editForm.value.birthDate,
        aboutMe: this.editForm.value.aboutMe,
      })
      .pipe(finalize(() => this.visible.set(false)))
      .subscribe();
  }
}
