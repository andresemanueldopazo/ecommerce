import { CreateProductInteractor } from './CreateProductInteractor';
import { CreateProductDTO } from './CreateProductDTO';
import { CreateProductErrors } from './CreateProductErrors';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { TextUtils } from '../../../../shared/utils/TextUtils';
import * as express from 'express';

export class CreateProductController extends BaseController {
  constructor(private interactor: CreateProductInteractor) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    let dto: CreateProductDTO = req.body as CreateProductDTO;
    dto = { ...dto, productName: TextUtils.sanitize(dto.productName) };

    const result = await this.interactor.execute(dto);
    if (result instanceof Error) {
      if (result instanceof CreateProductErrors.ProductAlreadyExistsError) {
        return this.conflict(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok(res);
    }
  }
}
