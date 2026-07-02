import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialog } from './change-password-dialog';

describe('ChangePasswordDialog', () => {
  let component: ChangePasswordDialog;
  let fixture: ComponentFixture<ChangePasswordDialog>;

  beforeEach(async () => {
    TestBed.overrideComponent(ChangePasswordDialog, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
