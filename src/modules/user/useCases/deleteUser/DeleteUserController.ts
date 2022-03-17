import { DeleteUserInteractor } from './DeleteUserInteractor';
import { DeleteUserDTO } from './DeleteUserDTO';
import { DeleteUserErrors } from './DeleteUserErrors';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import * as express from 'express';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';

export class DeleteUserController extends BaseController {
  private interactor: DeleteUserInteractor;

  constructor(interactor: DeleteUserInteractor) {
    super();
    this.interactor = interactor;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    const dto: DeleteUserDTO = req.body as DeleteUserDTO;

    const result = await this.interactor.execute(dto);
    if (result instanceof Error) {
      if (result instanceof DeleteUserErrors.UserNotFoundError) {
        return this.notFound(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok(res);
    }
  }
}
