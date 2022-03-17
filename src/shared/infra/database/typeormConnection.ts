import { ConnectionManager } from 'typeorm';
import { BaseProduct } from '../../../modules/product/infra/database/BaseProduct';
import { BaseUser } from '../../../modules/user/infra/database/BaseUser';
import { BaseUserSubscriber } from './hooks/UserSuscriber';

const connectionManager = new ConnectionManager();
const typeormConnection = connectionManager.create({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [BaseUser, BaseProduct],
  subscribers: [BaseUserSubscriber],
  synchronize: true,
  logging: false,
});

(async () => {
  await typeormConnection.connect();
  console.log('Typeorm client connected');
})();

export { typeormConnection };
