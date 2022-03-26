import { LoginErrors } from './LoginErrors';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import * as express from 'express';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';
import { LoginInteractor } from './LoginInteractor';
import { LoginDTORequest, LoginDTOResponse } from './LoginDTO';
import { AppError } from '../../../../shared/core/AppError';

export class LoginController extends BaseController {
  constructor(private readonly interactor: LoginInteractor) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    const dto: LoginDTORequest = req.body as LoginDTORequest;

    const result = await this.interactor.execute(dto);
    if (result instanceof AppError) {
      if (result instanceof LoginErrors.UserNameDoesntExistError) {
        return this.notFound(res, result.message);
      } else if (result instanceof LoginErrors.PasswordDoesntMatchError) {
        return this.clientError(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok<LoginDTOResponse>(res, result);
    }
  }
}
