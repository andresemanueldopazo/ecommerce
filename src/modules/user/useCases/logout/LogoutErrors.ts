import { DomainError } from '../../../../shared/core/DomainError';

export namespace LogoutErrors {
  export class UserNotFoundOrDeletedError extends DomainError {
    constructor() {
      super(`User not found or doesn't exist anymore.`);
    }
  }
}
