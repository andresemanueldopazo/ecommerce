import { dataSource } from '../../../../shared/infra/database/dataSourceTypeorm';
import { Product } from '../../domain/Product';
import { ProductMap } from '../../mappers/ProductMap';
import { IProductRepo } from '../../repo/IProductRepo';
import { BaseProduct } from './BaseProduct';

export class TypeormProductRepo implements IProductRepo {
  async exists(productName: string): Promise<boolean> {
    const product = await dataSource
      .getRepository(BaseProduct)
      .findOneBy({ product_name: productName });

    return !!product === true;
  }

  async getProductByProductName(
    productName: string,
  ): Promise<Product | undefined> {
    const product = await dataSource
      .getRepository(BaseProduct)
      .findOneBy({ product_name: productName });

    return ProductMap.toDomain(product);
  }

  async delete(productName: string): Promise<void> {
    await dataSource
      .getRepository(BaseProduct)
      .delete({ product_name: productName });
  }

  async save(product: Product): Promise<void> {
    const rawProduct = await ProductMap.toPersistence(product);
    await dataSource.getRepository(BaseProduct).save(rawProduct);
  }
}
