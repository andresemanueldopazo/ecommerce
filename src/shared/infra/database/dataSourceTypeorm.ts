import { BaseProduct } from '../../../modules/product/infra/database/BaseProduct';
import { BaseUser } from '../../../modules/user/infra/database/BaseUser';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [BaseUser, BaseProduct],
  synchronize: true,
  logging: false,
});

export { dataSource };
