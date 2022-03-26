import { AppError } from '../../../shared/core/AppError';
import { Guard } from '../../../shared/core/Guard';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface ProductPriceProps {
  productPrice: number;
}

export class ProductPrice extends ValueObject<ProductPriceProps> {
  public static min = 0;

  get value(): number {
    return this.props.productPrice;
  }

  private constructor(props: ProductPriceProps) {
    super(props);
  }

  public static create(props: ProductPriceProps): AppError | ProductPrice {
    const minResult = Guard.equalOrGreaterThan(this.min, props.productPrice);
    if (!minResult.succeeded) {
      return new AppError(minResult.message);
    }

    const productPriceResult = Guard.againstNullOrUndefined(
      props.productPrice,
      'productPrice',
    );
    if (!productPriceResult.succeeded) {
      return new AppError(productPriceResult.message);
    }

    return new ProductPrice(props);
  }
}
