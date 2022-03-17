import { DomainError } from '../../../shared/core/DomainError';
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

  public static create(props: ProductNameProps): DomainError | ProductName {
    const productNameResult = Guard.againstNullOrUndefined(
      props.productName,
      'productName',
    );
    if (!productNameResult.succeeded) {
      return new DomainError(productNameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      props.productName,
    );
    if (!minLengthResult.succeeded) {
      return new DomainError(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.productName,
    );
    if (!maxLengthResult.succeeded) {
      return new DomainError(minLengthResult.message);
    }

    return new ProductName(props);
  }
}
