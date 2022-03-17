import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class BaseProduct {
  @PrimaryColumn()
  base_product_id: string;

  @Column()
  product_name: string;

  @Column('float', { unsigned: true })
  product_price: number;

  @Column('int', { unsigned: true })
  product_quantity: number;
}
