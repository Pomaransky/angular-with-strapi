import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { User } from '../../../../models/auth/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserApiService } from '../../../../services/user-api-service';
import { finalize, tap } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Spinner, DataRow } from '../../../../components';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-details-dialog',
  imports: [DialogModule, Spinner, ButtonModule, DataRow],
  templateUrl: './details-dialog.html',
  styleUrl: './details-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDialog {
  private userApiService = inject(UserApiService);
  private destroyRef = inject(DestroyRef);
  visible = signal<boolean>(false);
  user = signal<User | null>(null);
  isLoading = signal<boolean>(false);

  showDialog(id: number): void {
    this.isLoading.set(true);
    this.userApiService
      .getUser(id.toString())
      .pipe(
        tap((user) => {
          this.user.set(user);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    this.visible.set(true);
  }
}
