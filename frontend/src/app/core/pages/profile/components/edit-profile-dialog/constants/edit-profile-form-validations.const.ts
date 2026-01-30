import { ValidationMessage } from "../../../../../models";


interface EditProfileFormValidations {
  aboutMe: ValidationMessage[];
}

export const EDIT_PROFILE_FORM_VALIDATIONS: EditProfileFormValidations = {
  aboutMe: [
    { key: 'maxlength', message: 'About Me must be less than 255 characters' },
  ],
};