import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Order } from "../Order";

export class OrderCreated implements IDomainEvent {
  public dateTimeOccurred: string;
  public order: Order;

  constructor(order: Order) {
    this.dateTimeOccurred = new Date().toString();
    this.order = order;
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}
