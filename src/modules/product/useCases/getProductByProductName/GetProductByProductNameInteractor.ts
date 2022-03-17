import { GetProductByProductNameDTO } from './GetProductByProductNameDTO';
import { GetProductByProductNameErrors } from './GetProductByProductNameErrors';
import { ProductName } from '../../domain/ProductName';
import { Product } from '../../domain/Product';
import { DomainError } from '../../../../shared/core/DomainError';
import { IProductRepo } from '../../repo/IProductRepo';
import { Interactor } from '../../../../shared/core/Interactor';

export class GetProductByProductNameInteractor
  implements Interactor<GetProductByProductNameDTO, Promise<Error | Product>> {
  constructor(private productRepo: IProductRepo) {}

  public async execute(
    request: GetProductByProductNameDTO,
  ): Promise<Error | Product> {
    const productNameOrError = ProductName.create({
      productName: request.productName,
    });
    if (productNameOrError instanceof DomainError) return productNameOrError;

    const product = await this.productRepo.getProductByProductName(
      productNameOrError.value,
    );
    if (!product) {
      return new GetProductByProductNameErrors.ProductNotFoundError(
        productNameOrError.value,
      );
    }

    return product;
  }
}
