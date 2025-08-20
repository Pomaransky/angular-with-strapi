import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowActions } from './row-actions';

describe('RowActions', () => {
  let component: RowActions;
  let fixture: ComponentFixture<RowActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
