import { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { GetUserByUserNameErrors } from './GetUserByUserNameErrors';
import { UserName } from '../../domain/UserName';
import { User } from '../../domain/User';
import { DomainError } from '../../../../shared/core/DomainError';
import { IUserRepo } from '../../repo/IUserRepo';
import { Interactor } from '../../../../shared/core/Interactor';

export class GetUserByUserNameInteractor
  implements Interactor<GetUserByUserNameDTO, Promise<Error | User>> {
  constructor(private userRepo: IUserRepo) {}

  public async execute(request: GetUserByUserNameDTO): Promise<Error | User> {
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof DomainError) return userNameOrError;

    const user = await this.userRepo.getUserByUserName(userNameOrError.value);
    if (!user) {
      return new GetUserByUserNameErrors.UserNotFoundError(
        userNameOrError.value,
      );
    }

    return user;
  }
}
