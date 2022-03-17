import { DecodedExpressRequest } from '../../../../modules/user/infra/http/models/DecodedRequest';
import { IAuthService } from '../../../../modules/user/services/auth/IAuthService';

export class Middleware {
  constructor(private readonly authService: IAuthService) {}

  private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
    return res.status(status).send({ message });
  }

  public isSeller() {
    return async (req: DecodedExpressRequest, res, next) => {
      const { adminUser } = req.decoded;
      if (!adminUser) {
        return this.endRequest(
          403,
          'Only admins are authorized for this route.',
          res,
        );
      }
      return next();
    };
  }

  public isAuthenticated() {
    return async (req, res, next) => {
      const token = req.headers['authorization'];
      if (token) {
        const decoded = await this.authService.decodeJWT(token);

        if (!decoded) {
          return this.endRequest(403, 'Token signature expired.', res);
        }

        const { userName } = decoded;
        const tokens = await this.authService.getTokens(userName);

        if (tokens.length !== 0) {
          req.decoded = decoded;
          return next();
        } else {
          return this.endRequest(
            403,
            'Auth token not found. User is probably not logged in. Please login again.',
            res,
          );
        }
      } else {
        return this.endRequest(403, 'No access token provided', res);
      }
    };
  }
}
