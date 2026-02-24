import { ValidationMessage } from '../../../models';

interface ChangePasswordFormValidations {
  password: ValidationMessage[];
  passwordConfirmation: ValidationMessage[];
}

export const CHANGE_PASSWORD_FORM_VALIDATIONS: ChangePasswordFormValidations = {
  password: [
    { key: 'required', message: 'registerValidations.passwordRequired' },
    { key: 'minlength', message: 'registerValidations.passwordMinLength' },
    { key: 'pattern', message: 'registerValidations.passwordPattern' },
  ],
  passwordConfirmation: [
    { key: 'required', message: 'registerValidations.confirmPasswordRequired' },
    {
      key: 'passwordMismatch',
      message: 'registerValidations.passwordsMismatch',
    },
  ],
};
