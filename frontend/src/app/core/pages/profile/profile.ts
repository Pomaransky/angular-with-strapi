import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserStore } from '../../store/user.store';
import { Spinner, DataRow, Avatar } from '../../components';
import { ButtonModule } from 'primeng/button';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { DeepSignal } from '@ngrx/signals';
import { User } from '../../models/auth/user.model';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PageTitle } from '../../constants';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadModule,
} from 'primeng/fileupload';
import { ToastService } from '../../services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { UserApiService } from '../../services/user-api-service';
import { switchMap } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangePasswordDialog } from './components/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-profile',
  imports: [
    Spinner,
    ButtonModule,
    DataRow,
    EditProfileDialog,
    DatePipe,
    CardModule,
    Avatar,
    TranslateModule,
    FileUploadModule,
    TooltipModule,
    ChangePasswordDialog,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private userStore = inject(UserStore);
  private titleService = inject(Title);
  private userApiService = inject(UserApiService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  avatarMaxSizeBytes = 1000000; // 1MB

  user: DeepSignal<User | null> = this.userStore.me.data;
  isUserLoading: DeepSignal<boolean> = this.userStore.me.isLoading;

  @ViewChild(EditProfileDialog) editProfileDialog!: EditProfileDialog;
  @ViewChild(ChangePasswordDialog) changePasswordDialog!: ChangePasswordDialog;
  @ViewChild('avatarUpload') avatarUpload!: FileUpload;

  onEdit(): void {
    this.editProfileDialog.showDialog();
  }

  onChangePassword(): void {
    this.changePasswordDialog.showDialog();
  }

  onChangeAvatar(event: FileSelectEvent): void {
    const file = event.files?.[0];
    const currentUser = this.user();
    if (!currentUser || !file || currentUser.id === null) return;

    if (!this.checkFileRequirements(file)) {
      this.avatarUpload?.clear();
      return;
    }

    const currentAvatarId = currentUser.avatar?.id?.toString() ?? null;
    this.userApiService
      .uploadAvatar(file, currentUser.id, currentAvatarId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.userApiService.getMe()),
      )
      .subscribe();
  }

  private checkFileRequirements(file: File): boolean {
    if (file.size > this.avatarMaxSizeBytes) {
      this.toastService.errorToast(
        this.translate.instant('upload.maxFileSizeExceeded', {
          maxSize: '1 MB',
        }),
      );
      return false;
    }
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.toastService.errorToast(
        this.translate.instant('upload.invalidFileType', {
          fileTypes: 'JPEG, PNG',
        }),
      );
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.titleService.setTitle(PageTitle.PULSAR_PROFILE);
  }
}
