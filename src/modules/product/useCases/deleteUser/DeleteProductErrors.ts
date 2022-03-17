import { DomainError } from '../../../../shared/core/DomainError';

export namespace DeleteProductErrors {
  export class ProductNotFoundError extends DomainError {
    constructor() {
      super(`Product not found`);
    }
  }
}
