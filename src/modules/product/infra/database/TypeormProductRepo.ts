import { Product } from '../../domain/Product';
import { ProductMap } from '../../mappers/ProductMap';
import { IProductRepo } from '../../repo/IProductRepo';
import { BaseProduct } from './BaseProduct';

export class TypeormProductRepo implements IProductRepo {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async exists(productName: string): Promise<boolean> {
    const product = await this.client
      .getRepository(BaseProduct)
      .findOne({ product_name: productName });

    return !!product === true;
  }

  async getProductByProductName(productName: string): Promise<Product | null> {
    const product = await this.client
      .getRepository(BaseProduct)
      .findOne({ product_name: productName });

    if (!!product === false) return;
    return ProductMap.toDomain(product);
  }

  async delete(productName: string): Promise<void> {
    await this.client
      .getRepository(BaseProduct)
      .delete({ productname: productName });
  }

  async save(product: Product): Promise<void> {
    const rawProduct = await ProductMap.toPersistence(product);
    await this.client.getRepository(BaseProduct).save(rawProduct);
  }
}
