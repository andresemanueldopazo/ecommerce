import { AppError } from '../../../../shared/core/AppError';

export namespace GetProductByProductNameErrors {
  export class ProductNotFoundError extends AppError {
    constructor(productName: string) {
      super(`No product with the name ${productName} was found`);
    }
  }
}
