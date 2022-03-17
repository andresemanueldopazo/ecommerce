import { DomainError } from '../../../../shared/core/DomainError';

export namespace DeleteUserErrors {
  export class UserNotFoundError extends DomainError {
    constructor() {
      super(`User not found`);
    }
  }
}
