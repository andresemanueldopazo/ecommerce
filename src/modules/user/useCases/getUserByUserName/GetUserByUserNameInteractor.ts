import { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { GetUserByUserNameErrors } from './GetUserByUserNameErrors';
import { UserName } from '../../domain/UserName';
import { AppError } from '../../../../shared/core/AppError';
import { IUserRepo } from '../../repo/IUserRepo';
import { Interactor } from '../../../../shared/core/Interactor';
import { UserMap } from '../../mappers/UserMap';
import { UserDTO } from '../../dtos/UserDTO';

export class GetUserByUserNameInteractor
  implements Interactor<GetUserByUserNameDTO, Promise<AppError | UserDTO>> {
  constructor(private userRepo: IUserRepo) {}

  public async execute(
    request: GetUserByUserNameDTO,
  ): Promise<AppError | UserDTO> {
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof AppError) return userNameOrError;

    const user = await this.userRepo.getUserByUserName(userNameOrError.value);
    if (!user) {
      return new GetUserByUserNameErrors.UserNotFoundError(
        userNameOrError.value,
      );
    }

    return UserMap.toDTO(user);
  }
}
