import { LoginDTORequest, LoginDTOResponse } from './LoginDTO';
import { LoginErrors } from './LoginErrors';
import { IUserRepo } from '../../repo/IUserRepo';
import { User } from '../../domain/User';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { JWTToken, RefreshToken } from '../../domain/jwt';
import { IAuthService } from '../../services/auth/IAuthService';
import { Interactor } from '../../../../shared/core/Interactor';
import { DomainError } from '../../../../shared/core/DomainError';

export class LoginInteractor
  implements Interactor<LoginDTORequest, Promise<Error | LoginDTOResponse>> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  public async execute(
    request: LoginDTORequest,
  ): Promise<Error | LoginDTOResponse> {
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof DomainError) return userNameOrError;

    const passwordOrError = UserPassword.create({ value: request.password });
    if (passwordOrError instanceof DomainError) return passwordOrError;

    const user: User = await this.userRepo.getUserByUserName(
      userNameOrError.value,
    );
    if (!user || user.isDeleted) {
      return new LoginErrors.UserNameDoesntExistError();
    }

    const passwordValid = await user.password.comparePassword(
      passwordOrError.value,
    );
    if (!passwordValid) {
      return new LoginErrors.PasswordDoesntMatchError();
    }

    const accessToken: JWTToken = this.authService.signJWT({
      userName: user.userName.value,
      email: user.email.value,
      isEmailVerified: user.isEmailVerified,
      userId: user.userId.id.toString(),
      adminUser: user.isSeller,
    });

    const refreshToken: RefreshToken = this.authService.createRefreshToken();

    user.setAccessToken(accessToken, refreshToken);
    await this.userRepo.save(user);
    await this.authService.saveAuthenticatedUser(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
