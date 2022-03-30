import { LoginDTORequest, LoginDTOResponse } from './LoginDTO';
import { LoginErrors } from './LoginErrors';
import { IUserRepo } from '../../repo/IUserRepo';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
import { JWTToken, RefreshToken } from '../../domain/jwt';
import { IAuthService } from '../../services/auth/IAuthService';
import { Interactor } from '../../../../shared/core/Interactor';
import { AppError } from '../../../../shared/core/AppError';

export class LoginInteractor
  implements Interactor<LoginDTORequest, Promise<AppError | LoginDTOResponse>> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  public async execute(
    request: LoginDTORequest,
  ): Promise<AppError | LoginDTOResponse> {
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof AppError) return userNameOrError;

    const passwordOrError = UserPassword.create({
      value: request.password,
      hashed: false,
    });
    if (passwordOrError instanceof AppError) return passwordOrError;

    const user = await this.userRepo.getUserByUserName(userNameOrError.value);
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
      isSeller: user.isSeller,
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
