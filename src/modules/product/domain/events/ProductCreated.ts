import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Product } from '../Product';

export class ProductCreated implements IDomainEvent {
  public dateTimeOccurred: string;
  public product: Product;

  constructor(product: Product) {
    this.dateTimeOccurred = new Date().toString();
    this.product = product;
  }

  getAggregateId(): UniqueEntityID {
    return this.product.id;
  }
}
