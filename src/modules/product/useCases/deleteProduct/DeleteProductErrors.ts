import { AppError } from '../../../../shared/core/AppError';

export namespace DeleteProductErrors {
  export class ProductNotFoundError extends AppError {
    constructor() {
      super(`Product not found`);
    }
  }
}
