import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { SupportedLanguages, Theme } from '../../constants';
import { AppStore } from '../../store/app.store';
import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  let appStore: jasmine.SpyObj<
    Pick<InstanceType<typeof AppStore>, 'setTheme' | 'setLanguage'>
  > & {
    theme: () => Theme;
    language: () => SupportedLanguages;
  };

  beforeEach(async () => {
    appStore = {
      setTheme: jasmine.createSpy('setTheme'),
      setLanguage: jasmine.createSpy('setLanguage').and.returnValue(of(null)),
      theme: () => Theme.LIGHT,
      language: () => SupportedLanguages.EN,
    } as unknown as typeof appStore;

    TestBed.overrideComponent(Settings, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [{ provide: AppStore, useValue: appStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDarkModeChange', () => {
    it('should set dark theme when checked is true', () => {
      component.onDarkModeChange(true);

      expect(appStore.setTheme).toHaveBeenCalledWith(Theme.DARK);
    });

    it('should set light theme when checked is false', () => {
      component.onDarkModeChange(false);

      expect(appStore.setTheme).toHaveBeenCalledWith(Theme.LIGHT);
    });
  });

  describe('onLanguageChange', () => {
    it('should call setLanguage with selected language', () => {
      component.onLanguageChange(SupportedLanguages.PL);

      expect(appStore.setLanguage).toHaveBeenCalledWith(SupportedLanguages.PL);
    });

    it('should subscribe to setLanguage observable', () => {
      let subscribed = false;
      appStore.setLanguage.and.returnValue(
        new Observable((subscriber) => {
          subscribed = true;
          subscriber.next(null);
          subscriber.complete();
        }),
      );

      component.onLanguageChange(SupportedLanguages.EN);

      expect(subscribed).toBeTrue();
    });
  });
});
