import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace GetUserByUserNameErrors {
  export class UserNotFoundError extends InteractorError {
    constructor(userName: string) {
      super(`No user with the name ${userName} was found`);
    }
  }
}
