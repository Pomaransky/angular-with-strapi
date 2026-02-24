import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputField } from '../input-field/input-field';
import { ValidationMessage } from '../../models';
import { POST_VALIDATION_MESSAGES } from '../../pages/dashboard/constants/post-validation-messages.const';

export interface PostFormSubmit {
  content: string;
  parentDocumentId?: string;
}

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, InputField, ButtonModule, TranslateModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostForm {
  private fb = inject(FormBuilder);

  @Input() label = 'post.whatsOnYourMind';
  @Input() submitLabel = 'post.postLabel';
  @Input() rows = 5;
  @Input() parentDocumentId: string | undefined = undefined;

  submitForm = output<PostFormSubmit>();

  validationMessages: ValidationMessage[] = POST_VALIDATION_MESSAGES;

  form: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(255)]],
  });

  get inputId(): string {
    return this.parentDocumentId ? 'comment-content' : 'post-content';
  }

  onSubmit(): void {
    const trimmed = this.form.get('content')?.value?.trim();
    if (!trimmed) return;
    this.submitForm.emit({
      content: trimmed,
      parentDocumentId: this.parentDocumentId ?? undefined,
    });
  }

  reset(): void {
    this.form.reset();
  }
}
