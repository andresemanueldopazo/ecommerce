import { DomainError } from '../../../shared/core/DomainError';
import { Guard } from '../../../shared/core/Guard';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { ProductPriceChanged } from './events/ProductPriceChanged';
import { ProductQuantityChanged } from './events/ProductQuantityChanged';
import { ProductCreated } from './events/ProductCreated';
import { ProductId } from './ProductId';
import { ProductName } from './ProductName';
import { ProductPrice } from './ProductPrice';
import { ProductQuantity } from './ProductQuantity';
import { ProductDeleted } from './events/ProductDeleted';

interface ProductProps {
  productName: ProductName;
  productPrice: ProductPrice;
  productQuantity: ProductQuantity;
}

export class Product extends AggregateRoot<ProductProps> {
  get productId(): ProductId {
    return ProductId.create(this._id);
  }

  get productName(): ProductName {
    return this.props.productName;
  }

  get productPrice(): ProductPrice {
    return this.props.productPrice;
  }

  get productQuantity(): ProductQuantity {
    return this.props.productQuantity;
  }

  public delete() {
    this.addDomainEvent(new ProductDeleted(this));
  }

  public changeQuantity(quantity: ProductQuantity): DomainError | void {
    this.props.productQuantity = quantity;
    this.addDomainEvent(new ProductQuantityChanged(this));
  }

  public changePrice(price: ProductPrice): DomainError | void {
    this.props.productPrice = price;
    this.addDomainEvent(new ProductPriceChanged(this));
  }

  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ProductProps,
    id?: UniqueEntityID,
  ): DomainError | Product {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.productName, argumentName: 'productName' },
      { argument: props.productQuantity, argumentName: 'productQuantity' },
      { argument: props.productPrice, argumentName: 'productPrice' },
    ]);

    if (!guardResult.succeeded) {
      return new DomainError(guardResult.message);
    }

    const isNewProduct = !!id === false;
    const product = new Product(props, id);

    if (isNewProduct) {
      product.addDomainEvent(new ProductCreated(product));
    }

    return product;
  }
}
