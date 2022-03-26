import { AppError } from '../../../shared/core/AppError';
import { Guard } from '../../../shared/core/Guard';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface ProductNameProps {
  productName: string;
}

export class ProductName extends ValueObject<ProductNameProps> {
  public static maxLength = 15;
  public static minLength = 2;

  get value(): string {
    return this.props.productName;
  }

  private constructor(props: ProductNameProps) {
    super(props);
  }

  public static create(props: ProductNameProps): AppError | ProductName {
    const productNameResult = Guard.againstNullOrUndefined(
      props.productName,
      'productName',
    );
    if (!productNameResult.succeeded) {
      return new AppError(productNameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      props.productName,
    );
    if (!minLengthResult.succeeded) {
      return new AppError(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.productName,
    );
    if (!maxLengthResult.succeeded) {
      return new AppError(minLengthResult.message);
    }

    return new ProductName(props);
  }
}
