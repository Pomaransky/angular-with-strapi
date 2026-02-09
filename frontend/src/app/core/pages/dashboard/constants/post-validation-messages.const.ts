import { ValidationMessage } from '../../../models';

export const POST_VALIDATION_MESSAGES: ValidationMessage[] = [
  { key: 'maxlength', message: 'Post must be less than 255 characters' },
];
