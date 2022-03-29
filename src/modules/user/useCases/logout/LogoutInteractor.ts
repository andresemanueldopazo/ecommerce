import { Interactor } from '../../../../shared/core/Interactor';
import { IUserRepo } from '../../repo/IUserRepo';
import { LogoutDTO } from './LogoutDTO';
import { UserId } from '../../domain/UserId';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { IAuthService } from '../../services/auth/IAuthService';
import { LogoutErrors } from './LogoutErrors';
import { AppError } from '../../../../shared/core/AppError';

export class LogoutInteractor
  implements Interactor<LogoutDTO, Promise<AppError | void>> {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly authService: IAuthService,
  ) {}

  public async execute(request: LogoutDTO): Promise<AppError | void> {
    const userId = UserId.create(new UniqueEntityID(request.userId));

    const user = await this.userRepo.getUserByUserId(userId.id.toString());
    if (!user) {
      return new LogoutErrors.UserNotFoundOrDeletedError();
    }

    await this.authService.deAuthenticateUser(user.userName.value);
  }
}
