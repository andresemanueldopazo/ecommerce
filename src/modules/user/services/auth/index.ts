import { KeyValueStoreAuthService } from './implementation/KeyValueStoreAuthService';
import { client } from './implementation/redis/redisConnection';
import { RedisKeyValueStore } from './implementation/redis/RedisKeyValueStore';

const authService = new KeyValueStoreAuthService(
  new RedisKeyValueStore(client),
);

export { authService };
