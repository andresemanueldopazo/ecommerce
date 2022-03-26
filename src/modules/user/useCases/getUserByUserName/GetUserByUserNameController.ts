import { GetUserByUserNameErrors } from './GetUserByUserNameErrors';
import { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { GetUserByUserNameInteractor } from './GetUserByUserNameInteractor';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import * as express from 'express';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';
import { AppError } from '../../../../shared/core/AppError';

export class GetUserByUserNameController extends BaseController {
  constructor(private interactor: GetUserByUserNameInteractor) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    const dto = req.body as GetUserByUserNameDTO;

    const result = await this.interactor.execute(dto);
    if (result instanceof AppError) {
      if (result instanceof GetUserByUserNameErrors.UserNotFoundError) {
        return this.notFound(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok(res, result);
    }
  }
}
