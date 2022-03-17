import { Interactor } from '../../../../shared/core/Interactor';
import { JWTToken } from '../../domain/jwt';
import { RefreshAccessTokenErrors } from './RefreshAccessTokenErrors';
import { IUserRepo } from '../../repo/IUserRepo';
import { UserName } from '../../domain/UserName';
import { RefreshAccessTokenDTO } from './RefreshAccessTokenDTO';
import { IAuthService } from '../../services/auth/IAuthService';
import { DomainError } from '../../../../shared/core/DomainError';

export class RefreshAccessToken
  implements Interactor<RefreshAccessTokenDTO, Promise<Error | JWTToken>> {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly authService: IAuthService,
  ) {}

  public async execute(
    request: RefreshAccessTokenDTO,
  ): Promise<Error | JWTToken> {
    const { refreshToken } = request;

    const stringUsername = await this.authService.getUserNameFromRefreshToken(
      refreshToken,
    );
    if (!stringUsername) {
      return new RefreshAccessTokenErrors.RefreshTokenNotFound();
    }

    const userNameOrError = UserName.create({ userName: stringUsername });
    if (userNameOrError instanceof DomainError) return userNameOrError;

    const user = await this.userRepo.getUserByUserName(userNameOrError.value);
    if (!user) {
      return new RefreshAccessTokenErrors.UserNotFoundOrDeletedError();
    }

    const accessToken: JWTToken = this.authService.signJWT({
      userName: user.userName.value,
      email: user.email.value,
      isEmailVerified: user.isEmailVerified,
      userId: user.userId.id.toString(),
      adminUser: user.isSeller,
    });

    user.setAccessToken(accessToken, refreshToken);

    await this.authService.saveAuthenticatedUser(user);

    return accessToken;
  }
}