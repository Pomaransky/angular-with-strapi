import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputField } from './input-field';

describe('InputField', () => {
  describe('standalone', () => {
    let component: InputField;
    let fixture: ComponentFixture<InputField>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InputField],
      }).compileComponents();

      fixture = TestBed.createComponent(InputField);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('inputId', 'test-id');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('propagates internalControl changes via onChange', () => {
        const onChangeSpy = jasmine.createSpy('onChange');
        component.registerOnChange(onChangeSpy);

        component.internalControl.setValue('hello');

        expect(component.value).toBe('hello');
        expect(onChangeSpy).toHaveBeenCalledWith('hello');
      });
    });

    describe('writeValue', () => {
      it('sets value and internalControl for text input', () => {
        component.writeValue('hello');

        expect(component.value).toBe('hello');
        expect(component.internalControl.value).toBe('hello');
      });

      it('sets empty string when value is null', () => {
        component.writeValue(null);

        expect(component.value).toBe('');
        expect(component.internalControl.value).toBe('');
      });

      it('does not update value when type is datepicker', () => {
        fixture.componentRef.setInput('type', 'datepicker');
        fixture.detectChanges();

        component.writeValue(new Date());

        expect(component.value).toBe('');
        expect(component.internalControl.value).toBe('');
      });
    });

    describe('setDisabledState', () => {
      it('disables internalControl when isDisabled is true', () => {
        component.setDisabledState(true);

        expect(component.disabled).toBeTrue();
        expect(component.internalControl.disabled).toBeTrue();
      });

      it('enables internalControl when isDisabled is false', () => {
        component.setDisabledState(true);
        component.setDisabledState(false);

        expect(component.disabled).toBeFalse();
        expect(component.internalControl.enabled).toBeTrue();
      });
    });

    describe('onInputChange', () => {
      it('updates value and calls onChange with input value', () => {
        const onChangeSpy = jasmine.createSpy('onChange');
        component.registerOnChange(onChangeSpy);

        component.onInputChange({
          target: { value: 'typed' },
        } as unknown as Event);

        expect(component.value).toBe('typed');
        expect(onChangeSpy).toHaveBeenCalledWith('typed');
      });
    });

    describe('onBlur', () => {
      it('calls onTouched', () => {
        const onTouchedSpy = jasmine.createSpy('onTouched');
        component.registerOnTouched(onTouchedSpy);

        component.onBlur();

        expect(onTouchedSpy).toHaveBeenCalled();
      });
    });
  });

  describe('with formControlName', () => {
    @Component({
      template: `
        <form [formGroup]="form">
          <app-input-field formControlName="name" inputId="name"></app-input-field>
        </form>
      `,
      imports: [ReactiveFormsModule, InputField],
    })
    class HostComponent {
      form = new FormGroup({ name: new FormControl('') });
    }

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
      }).compileComponents();
    });

    const getInputField = (
      hostFixture: ComponentFixture<HostComponent>,
    ): InputField =>
      hostFixture.debugElement.query(By.directive(InputField))
        .componentInstance as InputField;

    it('registers itself as valueAccessor in constructor', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();

      const inputField = hostFixture.debugElement.query(
        By.directive(InputField),
      ).componentInstance as InputField;

      expect(inputField.ngControl?.valueAccessor).toBe(inputField);
    });

    describe('isInvalid', () => {
      it('returns false when control is not touched', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        expect(getInputField(hostFixture).isInvalid).toBeFalse();
      });

      it('returns true when touched control has errors', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        control.setValidators(Validators.required);
        control.setValue('');
        control.markAsTouched();
        control.updateValueAndValidity();

        expect(getInputField(hostFixture).isInvalid).toBeTrue();
      });

      it('returns true when form has a matching validation error', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const inputField = getInputField(hostFixture);
        inputField.validationMessages = [
          { key: 'passwordMismatch', message: 'Passwords do not match' },
        ];

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        hostFixture.componentInstance.form.setErrors({
          passwordMismatch: true,
        });
        control.markAsTouched();

        expect(inputField.isInvalid).toBeTrue();
      });

      it('returns false when form errors do not match validationMessages', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const inputField = getInputField(hostFixture);
        inputField.validationMessages = [
          { key: 'required', message: 'Required' },
        ];

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        hostFixture.componentInstance.form.setErrors({
          passwordMismatch: true,
        });
        control.markAsTouched();

        expect(inputField.isInvalid).toBeFalse();
      });
    });

    describe('currentErrors', () => {
      it('returns empty array when control is not touched', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        expect(getInputField(hostFixture).currentErrors).toEqual([]);
      });

      it('returns empty array when touched control has no errors', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        control.markAsTouched();

        expect(getInputField(hostFixture).currentErrors).toEqual([]);
      });

      it('returns control-level error messages', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const inputField = getInputField(hostFixture);
        inputField.validationMessages = [
          { key: 'required', message: 'Required' },
        ];

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        control.setValidators(Validators.required);
        control.setValue('');
        control.markAsTouched();
        control.updateValueAndValidity();

        expect(inputField.currentErrors).toEqual(['Required']);
      });

      it('returns form-level error messages', () => {
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const inputField = getInputField(hostFixture);
        inputField.validationMessages = [
          { key: 'passwordMismatch', message: 'Passwords do not match' },
        ];

        const control = hostFixture.componentInstance.form.get(
          'name',
        ) as FormControl;
        hostFixture.componentInstance.form.setErrors({
          passwordMismatch: true,
        });
        control.markAsTouched();

        expect(inputField.currentErrors).toEqual(['Passwords do not match']);
      });
    });
  });
});
