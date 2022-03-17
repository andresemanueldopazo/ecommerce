import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace CreateProductErrors {
  export class ProductAlreadyExistsError extends InteractorError {
    constructor(productName: string) {
      super(`The product ${productName} already exists`);
    }
  }
}
