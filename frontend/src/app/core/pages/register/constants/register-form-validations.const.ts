import { ValidationMessage } from '../../../models';

interface RegisterValidations {
  username: ValidationMessage[];
  email: ValidationMessage[];
  password: ValidationMessage[];
  confirmPassword: ValidationMessage[];
}

export const REGISTER_VALIDATIONS: RegisterValidations = {
  username: [{ key: 'required', message: 'registerValidations.usernameRequired' }],
  email: [
    { key: 'required', message: 'registerValidations.emailRequired' },
    { key: 'email', message: 'registerValidations.invalidEmail' },
  ],
  password: [
    { key: 'required', message: 'registerValidations.passwordRequired' },
    { key: 'minlength', message: 'registerValidations.passwordMinLength' },
    { key: 'pattern', message: 'registerValidations.passwordPattern' },
  ],
  confirmPassword: [
    { key: 'required', message: 'registerValidations.confirmPasswordRequired' },
    { key: 'passwordMismatch', message: 'registerValidations.passwordsMismatch' },
  ],
};
