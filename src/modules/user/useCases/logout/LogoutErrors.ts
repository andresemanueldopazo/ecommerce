import { AppError } from '../../../../shared/core/AppError';

export namespace LogoutErrors {
  export class UserNotFoundOrDeletedError extends AppError {
    constructor() {
      super(`User not found or doesn't exist anymore.`);
    }
  }
}
