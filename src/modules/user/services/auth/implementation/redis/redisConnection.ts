import { createClient } from 'redis';

const redisConnection = createClient();

redisConnection.on('connect', () => console.log('Redis client connected'));
(async () => {
  await redisConnection.connect();
})();

export { redisConnection };
