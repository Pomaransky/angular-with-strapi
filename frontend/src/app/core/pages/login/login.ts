import { AuthService } from './../../services/auth-service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginCredentials } from '../../models/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    CardModule,
    DividerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.isLoading = true;
      const credentials: LoginCredentials = this.loginForm.value;

      this.authService
        .login(credentials)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe();
    }
  }
}
