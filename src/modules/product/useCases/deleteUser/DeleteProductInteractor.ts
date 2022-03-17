import { DomainError } from '../../../../shared/core/DomainError';
import { Interactor } from '../../../../shared/core/Interactor';
import { ProductName } from '../../domain/ProductName';
import { IProductRepo } from '../../repo/IProductRepo';
import { DeleteProductDTO } from './DeleteProductDTO';
import { DeleteProductErrors } from './DeleteProductErrors';

export class DeleteProductInteractor
  implements Interactor<DeleteProductDTO, Error | void> {
  constructor(private readonly productRepo: IProductRepo) {}

  async execute(request: DeleteProductDTO): Promise<Error | void> {
    const productNameOrError = ProductName.create({
      productName: request.productName,
    });
    if (productNameOrError instanceof DomainError) return productNameOrError;

    const product = await this.productRepo.getProductByProductName(
      productNameOrError.value,
    );
    if (!product) {
      return new DeleteProductErrors.ProductNotFoundError();
    }

    product.delete();
    await this.productRepo.delete(product.productName.value);
  }
}
