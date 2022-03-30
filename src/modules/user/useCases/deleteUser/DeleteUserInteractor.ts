import { DeleteUserDTO } from './DeleteUserDTO';
import { DeleteUserErrors } from './DeleteUserErrors';
import { Interactor } from '../../../../shared/core/Interactor';
import { IUserRepo } from '../../repo/IUserRepo';
import { IAuthService } from '../../services/auth/IAuthService';
import { AppError } from '../../../../shared/core/AppError';
import { UserName } from '../../domain/UserName';

export class DeleteUserInteractor
  implements Interactor<DeleteUserDTO, AppError | void> {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly authService: IAuthService,
  ) {}

  async execute(request: DeleteUserDTO): Promise<AppError | void> {
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof AppError) return userNameOrError;

    const user = await this.userRepo.getUserByUserName(userNameOrError.value);
    if (!user) {
      return new DeleteUserErrors.UserNotFoundError();
    }

    user.delete();
    await this.userRepo.save(user);
    await this.authService.deAuthenticateUser(user.userName.value);
  }
}
