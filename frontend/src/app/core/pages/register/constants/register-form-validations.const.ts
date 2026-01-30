import { ValidationMessage } from "../../../models";

interface RegisterValidations {
  username: ValidationMessage[];
  email: ValidationMessage[];
  password: ValidationMessage[];
  confirmPassword: ValidationMessage[];
}

export const REGISTER_VALIDATIONS: RegisterValidations = {
  username: [
    { key: 'required', message: 'Username is required' },
  ],
  email: [
    { key: 'required', message: 'Email is required' },
    { key: 'email', message: 'Invalid email address' },
  ],
  password: [
    { key: 'required', message: 'Password is required' },
    { key: 'minlength', message: 'Password must be at least 8 characters' },
    { key: 'pattern', message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
  ],
  confirmPassword: [
    { key: 'required', message: 'Confirm password is required' },
    { key: 'passwordMismatch', message: 'Passwords do not match' },
  ],
};
