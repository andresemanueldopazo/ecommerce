import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends InteractorError {
    constructor(email: string) {
      super(`The email ${email} associated for this account already exists`);
    }
  }

  export class UserNameTakenError extends InteractorError {
    constructor(userName: string) {
      super(`The userName ${userName} was already taken`);
    }
  }
}
