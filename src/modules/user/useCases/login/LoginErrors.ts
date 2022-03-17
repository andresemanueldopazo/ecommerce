import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace LoginErrors {
  export class UserNameDoesntExistError extends InteractorError {
    constructor() {
      super(`Username or password incorrect.`);
    }
  }

  export class PasswordDoesntMatchError extends InteractorError {
    constructor() {
      super(`Password doesnt match error.`);
    }
  }
}
