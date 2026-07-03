import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserApiService } from '../../services/user-api-service';
import { UserStore } from '../../store/user.store';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    TestBed.overrideComponent(Dashboard, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        {
          provide: UserStore,
          useValue: { me: { data: signal(null), isLoading: signal(false) } },
        },
        { provide: UserApiService, useValue: { getMe: () => of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
