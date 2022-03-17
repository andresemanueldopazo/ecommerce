import { DomainError } from '../../../../shared/core/DomainError';
import { Interactor } from '../../../../shared/core/Interactor';
import { Product } from '../../domain/Product';
import { ProductName } from '../../domain/ProductName';
import { ProductPrice } from '../../domain/ProductPrice';
import { ProductQuantity } from '../../domain/ProductQuantity';
import { IProductRepo } from '../../repo/IProductRepo';
import { CreateProductDTO } from './CreateProductDTO';
import { CreateProductErrors } from './CreateProductErrors';

export class CreateProductInteractor
  implements Interactor<CreateProductDTO, Error | void> {
  constructor(private readonly productRepo: IProductRepo) {}

  async execute(request: CreateProductDTO): Promise<Error | void> {
    const productNameOrError = ProductName.create({
      productName: request.productName,
    });
    if (productNameOrError instanceof DomainError) return productNameOrError;

    const productQuantityOrError = ProductQuantity.create({
      productQuantity: request.productQuantity,
    });
    if (productQuantityOrError instanceof DomainError)
      return productQuantityOrError;

    const productPriceOrError = ProductPrice.create({
      productPrice: request.productPrice,
    });
    if (productPriceOrError instanceof DomainError) return productPriceOrError;

    const productAlreadyExists = await this.productRepo.exists(
      productNameOrError.value,
    );
    if (productAlreadyExists) {
      return new CreateProductErrors.ProductAlreadyExistsError(
        productNameOrError.value,
      );
    }

    const productOrError = Product.create({
      productName: productNameOrError,
      productQuantity: productQuantityOrError,
      productPrice: productPriceOrError,
    });
    if (productOrError instanceof DomainError) return productOrError;

    await this.productRepo.save(productOrError);
  }
}
