import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRow } from './data-row';

describe('DataRow', () => {
  let component: DataRow;
  let fixture: ComponentFixture<DataRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataRow],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
