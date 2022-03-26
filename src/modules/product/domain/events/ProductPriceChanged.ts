import { Product } from '../Product';
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export class ProductPriceChanged implements IDomainEvent {
  public dateTimeOccurred: string;
  public product: Product;

  constructor(product: Product) {
    this.dateTimeOccurred = new Date().toString();
    this.product = product;
  }

  public getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
