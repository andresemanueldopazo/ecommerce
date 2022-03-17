import { DomainError } from '../../../shared/core/DomainError';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Product } from '../domain/Product';
import { ProductName } from '../domain/ProductName';
import { ProductPrice } from '../domain/ProductPrice';
import { ProductQuantity } from '../domain/ProductQuantity';
import { ProductDTO } from '../dtos/ProductDTO';

export class ProductMap {
  public static toDTO(product: Product): ProductDTO {
    return {
      productName: product.productName.value,
      productPrice: product.productPrice.value,
      productQuantity: product.productQuantity.value,
    };
  }

  public static toDomain(raw: any): Product {
    const productNameOrError = ProductName.create({
      productName: raw.product_name,
    });
    const productPriceOrError = ProductPrice.create({
      productPrice: raw.product_price,
    });
    const productQuantityOrError = ProductQuantity.create({
      productQuantity: raw.product_quantity,
    });

    const productOrError = Product.create(
      {
        productName: productNameOrError as ProductName,
        productPrice: productPriceOrError as ProductPrice,
        productQuantity: productQuantityOrError as ProductQuantity,
      },
      new UniqueEntityID(raw.base_product_id),
    );

    if (productOrError instanceof DomainError) return;

    return productOrError;
  }

  public static async toPersistence(product: Product): Promise<any> {
    return {
      base_product_id: product.productId.id.toString(),
      product_name: product.productName.value,
      product_price: product.productPrice.value,
      product_quantity: product.productQuantity.value,
    };
  }
}
