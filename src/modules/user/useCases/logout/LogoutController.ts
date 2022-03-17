import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';
import { LogoutInteractor } from './LogoutInteractor';
import * as express from 'express';

export class LogoutController extends BaseController {
  constructor(private interactor: LogoutInteractor) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    const { userId } = req.decoded;

    const result = await this.interactor.execute({ userId });
    if (result instanceof Error) {
      return this.fail(res, result.message);
    } else {
      return this.ok(res);
    }
  }
}
