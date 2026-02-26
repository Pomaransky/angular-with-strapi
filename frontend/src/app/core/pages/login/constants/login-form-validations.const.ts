import { ValidationMessage } from '../../../models';

interface LoginValidations {
  identifier: ValidationMessage[];
  password: ValidationMessage[];
}

export const LOGIN_FORM_VALIDATIONS: LoginValidations = {
  identifier: [{ key: 'required', message: 'login.emailOrUsernameRequired' }],
  password: [
    { key: 'required', message: 'login.passwordRequired' },
    { key: 'minlength', message: 'login.passwordMinLength' },
  ],
};
