import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

import { Sidebar } from './sidebar';
import { ModalType } from '../../../../constants';
import { AuthService } from '../../../../services/auth-service';
import { ModalService } from '../../../../services/modal.service';
import { AppStore } from '../../../../store/app.store';
import { UserStore } from '../../../../store/user.store';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;

  const userStoreStub = {
    me: {
      isLoading: () => false,
      data: () => ({ role: { type: 'authenticated' } }),
    },
  };

  const appStoreStub = {
    language: () => 'pl',
    theme: () => 'light',
    setTheme: () => void 0,
    setLanguage: () => of(void 0),
  };

  const translateServiceStub = {
    instant: (key: string) => key,
    get: (key: string) => of(key),
    stream: (key: string) => of(key),
    onLangChange: new Subject(),
    onTranslationChange: new Subject(),
    onDefaultLangChange: new Subject(),
  };

  beforeEach(async () => {
    confirmationServiceSpy = jasmine.createSpyObj<ConfirmationService>('ConfirmationService', ['confirm']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    modalServiceSpy = jasmine.createSpyObj<ModalService>('ModalService', ['open']);

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: UserStore, useValue: userStoreStub },
        { provide: AppStore, useValue: appStoreStub },
        { provide: ModalService, useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build translated and filtered menu items', () => {
    const items = component.items();
    const usersItem = items.find((item) => item.label === 'menu.users');
    const privacyItem = items.find((item) => item.label === 'menu.privacyPolicy');

    expect(items.length).toBeGreaterThan(0);
    expect(usersItem?.visible).toBeFalse();
    expect(privacyItem?.command).toBeDefined();
  });

  it('should open privacy modal from privacy item command', () => {
    const items = component.items();
    const privacyItem = items.find((item) => item.label === 'menu.privacyPolicy');

    privacyItem?.command?.({} as never);

    expect(modalServiceSpy.open).toHaveBeenCalledWith(ModalType.PRIVACY);
  });

  it('should check window dimensions on init', () => {
    const checkWindowDimensionsSpy = spyOn(component, 'checkWindowDimensions');

    component.ngOnInit();

    expect(checkWindowDimensionsSpy).toHaveBeenCalled();
  });

  it('should set popup menu mode on small screens', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 767 });

    component.checkWindowDimensions();

    expect(component.isMenuPopup).toBeTrue();

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalWidth,
    });
  });

  it('should set non-popup menu mode on large screens', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
    component.isMenuPopup = true;

    component.checkWindowDimensions();

    expect(component.isMenuPopup).toBeFalse();

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalWidth,
    });
  });

  it('should call confirmationService.confirm on logout', () => {
    const event = { target: document.createElement('button') } as unknown as Event;

    component.logout(event);

    expect(confirmationServiceSpy.confirm).toHaveBeenCalled();
  });

  it('should logout on confirm accept and keep no-op reject', () => {
    const event = { target: document.createElement('button') } as unknown as Event;
    component.logout(event);
    const confirmConfig = confirmationServiceSpy.confirm.calls.mostRecent().args[0] as {
      accept: () => void;
      reject: () => void;
    };

    confirmConfig.accept();
    confirmConfig.reject();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
