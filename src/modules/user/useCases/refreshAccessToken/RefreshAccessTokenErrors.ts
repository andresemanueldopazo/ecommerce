import { AppError } from '../../../../shared/core/AppError';

export namespace RefreshAccessTokenErrors {
  export class RefreshTokenNotFound extends AppError {
    constructor() {
      super(`Refresh token doesn't exist`);
    }
  }

  export class UserNotFoundOrDeletedError extends AppError {
    constructor() {
      super(`User not found or doesn't exist anymore.`);
    }
  }
}
