import { redisConnection } from './implementation/redis/redisConnection';
import { KeyValueStoreAuthService } from './implementation/KeyValueStoreAuthService';
import { RedisKeyValueStore } from './implementation/redis/RedisKeyValueStore';

const authService = new KeyValueStoreAuthService(
  new RedisKeyValueStore(redisConnection),
);

export { authService };
