import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';
import { GetUserByUserNameInteractor } from '../getUserByUserName/GetUserByUserNameInteractor';
import { UserMap } from '../../mappers/UserMap';
import * as express from 'express';
import { AppError } from '../../../../shared/core/AppError';

export class GetCurrentUserController extends BaseController {
  constructor(private interactor: GetUserByUserNameInteractor) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    const { userName } = req.decoded;

    const userOrError = await this.interactor.execute({ userName });
    if (userOrError instanceof AppError) {
      return this.fail(res, userOrError.message);
    } else {
      return this.ok(res, {
        user: UserMap.toDTO(userOrError),
      });
    }
  }
}
