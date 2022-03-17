import { Product } from '../Product';
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export class ProductPriceChanged implements IDomainEvent {
  public dateTimeOccurred: Date;
  public product: Product;

  constructor(product: Product) {
    this.dateTimeOccurred = new Date();
    this.product = product;
  }

  public getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
