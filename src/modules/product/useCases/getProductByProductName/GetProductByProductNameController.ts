import { GetProductByProductNameErrors } from './GetProductByProductNameErrors';
import { GetProductByProductNameDTO } from './GetProductByProductNameDTO';
import { GetProductByProductNameInteractor } from './GetProductByProductNameInteractor';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import * as express from 'express';

export class GetProductByProductNameController extends BaseController {
  constructor(private interactor: GetProductByProductNameInteractor) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto = req.body as GetProductByProductNameDTO;

    const result = await this.interactor.execute(dto);
    if (result instanceof Error) {
      if (
        result instanceof GetProductByProductNameErrors.ProductNotFoundError
      ) {
        return this.notFound(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok(res, result);
    }
  }
}
