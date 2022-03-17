import { DeleteUserDTO } from './DeleteUserDTO';
import { DeleteUserErrors } from './DeleteUserErrors';
import { Interactor } from '../../../../shared/core/Interactor';
import { UserId } from '../../domain/UserId';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { IUserRepo } from '../../repo/IUserRepo';
import { IAuthService } from '../../services/auth/IAuthService';

export class DeleteUserInteractor
  implements Interactor<DeleteUserDTO, Error | void> {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly authService: IAuthService,
  ) {}

  async execute(request: DeleteUserDTO): Promise<Error | void> {
    const userId = UserId.create(new UniqueEntityID(request.userId));

    const user = await this.userRepo.getUserByUserId(userId.id.toString());
    if (!user) {
      return new DeleteUserErrors.UserNotFoundError();
    }

    user.delete();
    await this.userRepo.save(user);
    await this.authService.deAuthenticateUser(user.userName.value);
  }
}
