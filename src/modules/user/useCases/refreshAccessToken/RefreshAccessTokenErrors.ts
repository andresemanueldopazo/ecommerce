import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace RefreshAccessTokenErrors {
  export class RefreshTokenNotFound extends InteractorError {
    constructor() {
      super(`Refresh token doesn't exist`);
    }
  }

  export class UserNotFoundOrDeletedError extends InteractorError {
    constructor() {
      super(`User not found or doesn't exist anymore.`);
    }
  }
}
