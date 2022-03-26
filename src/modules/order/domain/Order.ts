import { AppError } from "../../../shared/core/AppError";
import { Guard } from "../../../shared/core/Guard";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Product } from "../../product/domain/Product";
import { User } from "../../user/domain/User";
import { OrderCreated } from "./events/OrderCreated";
import { OrderId } from "./OrderId";

interface OrderProps {
	customer: User;
	products: Product[];
	date: string;
}

export class Order extends AggregateRoot<OrderProps> {
  get orderId(): OrderId {
    return OrderId.create(this._id);
  }

  get customer(): User {
    return this.props.customer;
  }

  get products(): Product[] {
    return this.props.products;
  }

  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OrderProps, id?: UniqueEntityID): AppError | Order {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.customer, argumentName: 'customer' },
      { argument: props.products, argumentName: 'products' },
    ]);

    if (!guardResult.succeeded) {
      return new AppError(guardResult.message);
    }

    const isNewOrder = !!id === false;
		const date = isNewOrder? new Date(Date.now()): props.date
    const order = new Order(
			{ ...props, date },
			id
		);

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreated(order));
    }

    return order;
  }
}
