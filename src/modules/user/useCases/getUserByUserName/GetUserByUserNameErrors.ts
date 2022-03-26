import { AppError } from '../../../../shared/core/AppError';

export namespace GetUserByUserNameErrors {
  export class UserNotFoundError extends AppError {
    constructor(userName: string) {
      super(`No user with the name ${userName} was found`);
    }
  }
}
