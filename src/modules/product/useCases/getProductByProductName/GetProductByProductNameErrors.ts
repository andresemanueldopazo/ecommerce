import { InteractorError } from '../../../../shared/core/InteractorError';

export namespace GetProductByProductNameErrors {
  export class ProductNotFoundError extends InteractorError {
    constructor(productName: string) {
      super(`No product with the name ${productName} was found`);
    }
  }
}
