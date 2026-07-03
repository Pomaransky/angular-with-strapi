import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog } from './dialog';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog],
    }).compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onVisibleChange', () => {
    it('emits the given value', () => {
      spyOn(component.visibleChange, 'emit');

      component.onVisibleChange(true);

      expect(component.visibleChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('close', () => {
    it('emits false', () => {
      spyOn(component.visibleChange, 'emit');

      component.close();

      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });
  });
});
