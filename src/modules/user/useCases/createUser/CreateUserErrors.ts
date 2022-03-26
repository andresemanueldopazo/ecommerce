import { AppError } from '../../../../shared/core/AppError';

export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends AppError {
    constructor(email: string) {
      super(`The email ${email} associated for this account already exists`);
    }
  }

  export class UserNameTakenError extends AppError {
    constructor(userName: string) {
      super(`The userName ${userName} was already taken`);
    }
  }
}
