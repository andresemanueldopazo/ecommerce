import { AppError } from '../../../../shared/core/AppError';

export namespace DeleteUserErrors {
  export class UserNotFoundError extends AppError {
    constructor() {
      super(`User not found`);
    }
  }
}
