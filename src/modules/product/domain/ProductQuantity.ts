import { AppError } from '../../../shared/core/AppError';
import { Guard } from '../../../shared/core/Guard';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface ProductQuantityProps {
  productQuantity: number;
}

export class ProductQuantity extends ValueObject<ProductQuantityProps> {
  public static min: number = 0;

  get value(): number {
    return this.props.productQuantity;
  }

  private constructor(props: ProductQuantityProps) {
    super(props);
  }

  public static create(
    props: ProductQuantityProps,
  ): AppError | ProductQuantity {
    const productQuantityResult = Guard.againstNullOrUndefined(
      props.productQuantity,
      'productQuantity',
    );
    if (!productQuantityResult.succeeded) {
      return new AppError(productQuantityResult.message);
    }

    const minResult = Guard.equalOrGreaterThan(this.min, props.productQuantity);
    if (!minResult.succeeded) {
      return new AppError(minResult.message);
    }

    return new ProductQuantity(props);
  }
}
