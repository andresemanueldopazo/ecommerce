import { Product } from '../domain/Product';

export interface IProductRepo {
  exists(productEmail: string): Promise<boolean>;
  getProductByProductName(productName: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
  delete(productName: string): Promise<void>;
}
