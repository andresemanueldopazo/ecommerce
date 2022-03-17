import { Product } from '../Product';
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export class ProductDeleted implements IDomainEvent {
  public dateTimeOccurred: Date;
  public product: Product;

  constructor(product: Product) {
    this.dateTimeOccurred = new Date();
    this.product = product;
  }

  getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
