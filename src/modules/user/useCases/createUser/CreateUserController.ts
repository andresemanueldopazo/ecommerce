import { CreateUserInteractor } from './CreateUserInteractor';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserErrors } from './CreateUserErrors';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { TextUtils } from '../../../../shared/utils/TextUtils';
import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest';
import * as express from 'express';

export class CreateUserController extends BaseController {
  constructor(private interactor: CreateUserInteractor) {
    super();
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response,
  ): Promise<any> {
    let dto: CreateUserDTO = req.body as CreateUserDTO;

    dto = {
      userName: TextUtils.sanitize(dto.userName),
      email: TextUtils.sanitize(dto.email),
      password: dto.password,
    };

    const result = await this.interactor.execute(dto);
    if (result instanceof Error) {
      if (result instanceof CreateUserErrors.UserNameTakenError) {
        return this.conflict(res, result.message);
      } else if (result instanceof CreateUserErrors.EmailAlreadyExistsError) {
        return this.conflict(res, result.message);
      } else {
        return this.fail(res, result.message);
      }
    } else {
      return this.ok(res);
    }
  }
}
