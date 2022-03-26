import { AppError } from '../../../../shared/core/AppError';

export namespace LoginErrors {
  export class UserNameDoesntExistError extends AppError {
    constructor() {
      super(`Username or password incorrect.`);
    }
  }

  export class PasswordDoesntMatchError extends AppError {
    constructor() {
      super(`Password doesnt match error.`);
    }
  }
}
