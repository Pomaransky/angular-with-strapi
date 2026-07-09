import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  Event as RouterEvent,
  NavigationEnd,
  Router,
  convertToParamMap,
} from '@angular/router';
import { Subject } from 'rxjs';
import { App } from './app';
import { ModalService } from './core/services/modal.service';

describe('App', () => {
  let routerEvents$: Subject<RouterEvent>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let activatedRouteStub: {
    snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> };
  };

  beforeEach(async () => {
    routerEvents$ = new Subject<RouterEvent>();
    modalServiceSpy = jasmine.createSpyObj<ModalService>(
      'ModalService',
      ['isOpen', 'onDialogVisibleChange', 'syncFromRoute'],
      { queryParam: 'modal' },
    );
    modalServiceSpy.isOpen.and.returnValue(false);

    activatedRouteStub = {
      snapshot: {
        queryParamMap: convertToParamMap({ modal: 'privacy' }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
          } satisfies Partial<Router>,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should sync modal from route on init', () => {
    const fixture = TestBed.createComponent(App);

    fixture.componentInstance.ngOnInit();

    expect(modalServiceSpy.syncFromRoute).toHaveBeenCalledWith('privacy');
  });

  it('should resync modal on NavigationEnd event', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.ngOnInit();
    modalServiceSpy.syncFromRoute.calls.reset();

    routerEvents$.next(new NavigationEnd(1, '/login', '/login'));

    expect(modalServiceSpy.syncFromRoute).toHaveBeenCalledWith('privacy');
  });

  it('should update showPrivacyHeaderClose on resize', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const originalWidth = window.innerWidth;

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 500,
    });
    app.showPrivacyHeaderClose = false;

    app.onResize();

    expect(app.showPrivacyHeaderClose).toBeTrue();

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalWidth,
    });
  });
});
