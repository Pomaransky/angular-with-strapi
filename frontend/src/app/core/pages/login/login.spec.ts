import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth-service';
import { AnalyticsService } from '../../services/analytics-service';
import { ModalService } from '../../services/modal.service';
import { ModalType } from '../../constants';
import { AuthResponse } from '../../models/auth';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    modalServiceSpy = jasmine.createSpyObj<ModalService>('ModalService', ['open']);

    TestBed.overrideComponent(Login, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: AnalyticsService,
          useValue: jasmine.createSpyObj<AnalyticsService>('AnalyticsService', ['track']),
        },
        { provide: Router, useValue: routerSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: Title, useValue: jasmine.createSpyObj<Title>('Title', ['setTitle']) },
      ],
    }).compileComponents();

    const analyticsService = TestBed.inject(
      AnalyticsService,
    ) as jasmine.SpyObj<AnalyticsService>;
    analyticsService.track.and.returnValue(of({ ok: true }));

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not login when form is invalid', () => {
    component.loginForm.setValue({
      identifier: '',
      password: '',
    });

    component.onLogin();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login and finalize loading state when form is valid', () => {
    const cdrSpy = spyOn((component as never as { cdr: { detectChanges: () => void } }).cdr, 'detectChanges');
    authServiceSpy.login.and.returnValue(of({} as AuthResponse));
    component.loginForm.setValue({
      identifier: 'user@example.com',
      password: 'secret123',
    });

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      identifier: 'user@example.com',
      password: 'secret123',
    });
    expect(component.isLoading).toBeFalse();
    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should set error message on login error and finalize loading state', () => {
    const cdrSpy = spyOn((component as never as { cdr: { detectChanges: () => void } }).cdr, 'detectChanges');
    authServiceSpy.login.and.returnValue(
      throwError(() => ({ message: 'Invalid credentials' })),
    );
    component.loginForm.setValue({
      identifier: 'user@example.com',
      password: 'secret123',
    });

    component.onLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBeFalse();
    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should navigate to register page', () => {
    component.onRegister();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should open privacy policy modal', () => {
    component.openPrivacyPolicy();

    expect(modalServiceSpy.open).toHaveBeenCalledWith(ModalType.PRIVACY);
  });
});
