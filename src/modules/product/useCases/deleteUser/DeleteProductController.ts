import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { DeleteUserDTO } from '../../../user/useCases/deleteUser/DeleteUserDTO';
import { DeleteUserErrors } from '../../../user/useCases/deleteUser/DeleteUserErrors';
import { DeleteUserInteractor } from '../../../user/useCases/deleteUser/DeleteUserInteractor';
import * as express from 'express';
import { AppError } from '../../../../shared/core/AppError';

export class DeleteUserController extends BaseController {
  private interactor: DeleteUserInteractor;

  constructor(interactor: DeleteUserInteractor) {
    super();
    this.interactor = interactor;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: DeleteUserDTO = req.body as DeleteUserDTO;

    const result = await this.interactor.execute(dto);
    if (result instanceof AppError) {
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
