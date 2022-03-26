import { AppError } from '../../../../shared/core/AppError';

export namespace CreateProductErrors {
  export class ProductAlreadyExistsError extends AppError {
    constructor(productName: string) {
      super(`The product ${productName} already exists`);
    }
  }
}
