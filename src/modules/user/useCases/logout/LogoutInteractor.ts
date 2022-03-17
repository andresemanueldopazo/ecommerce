import { Interactor } from '../../../../shared/core/Interactor';
import { IUserRepo } from '../../repo/IUserRepo';
import { LogoutDTO } from './LogoutDTO';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { IAuthService } from '../../services/auth/IAuthService';
import { LogoutErrors } from './LogoutErrors';

export class LogoutInteractor
  implements Interactor<LogoutDTO, Promise<Error | void>> {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly authService: IAuthService,
  ) {}

  public async execute(request: LogoutDTO): Promise<Error | void> {
    const userId = UserId.create(new UniqueEntityID(request.userId));

    const user: User = await this.userRepo.getUserByUserId(
      userId.id.toString(),
    );
    if (!user) {
      return new LogoutErrors.UserNotFoundOrDeletedError();
    }

    await this.authService.deAuthenticateUser(user.userName.value);
  }
}
