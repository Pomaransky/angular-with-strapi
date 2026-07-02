import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserRoleType } from '../../../../models/auth/user-role-type.enum';
import { UserApiService } from '../../../../services/user-api-service';
import { UserStore } from '../../../../store/user.store';

import { EditProfileDialog } from './edit-profile-dialog';

describe('EditProfileDialog', () => {
  let component: EditProfileDialog;
  let fixture: ComponentFixture<EditProfileDialog>;

  beforeEach(async () => {
    TestBed.overrideComponent(EditProfileDialog, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [EditProfileDialog],
      providers: [
        {
          provide: UserStore,
          useValue: {
            me: {
              data: signal({
                id: 1,
                documentId: 'user-1',
                username: 'tester',
                email: 'tester@example.com',
                provider: 'local',
                confirmed: true,
                blocked: false,
                role: {
                  id: 1,
                  name: 'Authenticated',
                  description: 'Authenticated user',
                  type: UserRoleType.AUTHENTICATED,
                },
              }),
            },
          },
        },
        {
          provide: UserApiService,
          useValue: {
            editMe: () => of(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
