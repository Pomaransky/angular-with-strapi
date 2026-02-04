import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { ValidationMessage } from '../../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, TextareaModule, IconField, InputIcon],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputField implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'textarea' = 'text';
  @Input() inputId: string = '';
  @Input() validationMessages: ValidationMessage[] = [];
  @Input() toggleMask: boolean = true;
  @Input() feedback: boolean = false;
  @Input() rows: number = 3;
  @Input() labelWidth: string = '';
  @Input() icon: string = '';

  private destroyRef = inject(DestroyRef);

  // Internal FormControl for p-password
  internalControl = new FormControl('');
  
  value: string = '';
  disabled: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (!this.inputId) {
      this.inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Sync internal control with parent
    this.internalControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.value = value || '';
        this.onChange(this.value);
      });
  }

  get control(): FormControl | null {
    return this.ngControl?.control as FormControl;
  }

  get isInvalid(): boolean {
    if (!this.control?.touched) {
      return false;
    }
    // Check both control-level and form-level errors
    const hasControlErrors = this.control.invalid;
    const hasFormErrors = this.control.parent?.errors != null;
    
    // For form-level errors, check if any validationMessages match
    const hasRelevantFormErrors = hasFormErrors && this.validationMessages.some(
      msg => this.control?.parent?.errors?.[msg.key]
    );
    
    return hasControlErrors || hasRelevantFormErrors;
  }

  get currentErrors(): string[] {
    if (!this.control?.touched) {
      return [];
    }

    const errors: string[] = [];
    const controlErrors = this.control.errors;
    // Check form-level errors (like passwordMismatch)
    const formErrors = this.control.parent?.errors;
    
    if (!controlErrors && !formErrors) {
      return [];
    }
    
    for (const msg of this.validationMessages) {
      if (controlErrors?.[msg.key] || formErrors?.[msg.key]) {
        errors.push(msg.message);
      }
    }

    return errors;
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.internalControl.setValue(this.value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.internalControl.disable({ emitEvent: false });
    } else {
      this.internalControl.enable({ emitEvent: false });
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
