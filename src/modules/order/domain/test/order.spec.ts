import { AppError } from "../../../../shared/core/AppError";
import { Product } from "../../../product/domain/Product";
import { ProductName } from "../../../product/domain/ProductName";
import { ProductPrice } from "../../../product/domain/ProductPrice";
import { ProductQuantity } from "../../../product/domain/ProductQuantity";
import { User } from "../../../user/domain/User";
import { UserEmail } from "../../../user/domain/UserEmail";
import { UserName } from "../../../user/domain/UserName";
import { UserPassword } from "../../../user/domain/UserPassword";
import { Order } from "../Order";
import { OrderId } from "../OrderId";

let orderOrError: AppError | Order;
let user: User;
let products: Product[];

describe ('Order', () => {
  beforeAll(() => {
    const userName = UserName.create({ userName: "Juan" }) as UserName; 
    const email = UserEmail.create("juan@gmail.com") as UserEmail;
    const password = UserPassword.create({ value: "JuanPassword1" }) as UserPassword;
    user = User.create({ userName, email, password}) as User;
    const productName = ProductName.create({ productName: 'Cacerola' }) as ProductName;
    const productPrice = ProductPrice.create({ productPrice: 122.30}) as ProductPrice;
    const productQuantity = ProductQuantity.create({ productQuantity: 5 }) as ProductQuantity; 
    const product = Product.create({ productName, productQuantity, productPrice }) as Product;
    products = [product];
  });

  beforeEach(() => {
    orderOrError = null;
  })

  it('Should be able to be created w/o genres', () => {

    orderOrError = Order.create({ 
      customer: user,
      products: products,
      date: new Date(Date.now())
    });

    expect(orderOrError.).;
    order = orderOrError.getValue();
    expect(order).toBeTruthy();
  });

})