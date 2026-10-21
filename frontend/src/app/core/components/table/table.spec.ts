import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table } from './table';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    TestBed.overrideComponent(Table, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Table],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not emit sort when lazy load event has empty sortField', () => {
    component.columns = [];
    component.pageSize = 5;
    const emitSpy = spyOn(component.loadParams, 'emit');

    component.onLazyLoadInternal({
      first: 5,
      rows: 5,
      sortField: '',
      sortOrder: 1,
    });

    expect(emitSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ page: 2, sort: undefined }),
    );
  });
});
