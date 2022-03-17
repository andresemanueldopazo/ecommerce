import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { RefreshAccessToken } from './RefreshAccessTokenInteractor';
import { RefreshAccessTokenDTO } from './RefreshAccessTokenDTO';
import { RefreshAccessTokenErrors } from './RefreshAccessTokenErrors';
import { JWTToken } from '../../domain/jwt';
import { LoginDTOResponse } from '../login/LoginDTO';
import * as express from 'express';

export class RefreshAccessTokenController extends BaseController {
  constructor(private readonly interactor: RefreshAccessToken) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: RefreshAccessTokenDTO = req.body as RefreshAccessTokenDTO;

    const result = await this.interactor.execute(dto);
    if (result instanceof Error) {
      if (result instanceof RefreshAccessTokenErrors.RefreshTokenNotFound) {
        return this.notFound(res, result.message);
      } else if (
        result instanceof RefreshAccessTokenErrors.UserNotFoundOrDeletedError
      ) {
        return this.notFound(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      const accessToken: JWTToken = result;
      return this.ok<LoginDTOResponse>(res, {
        refreshToken: dto.refreshToken,
        accessToken: accessToken,
      });
    }
  }
}
