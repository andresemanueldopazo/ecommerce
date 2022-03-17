import { IKeyValueStore } from '../IKeyValueStore';

export class RedisKeyValueStore implements IKeyValueStore {
  constructor(private readonly redisClient) {}

  public async count(key: string): Promise<number> {
    return this.getAllKeys(key)
      .then(allKeys => {
        return allKeys.length;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      });
  }

  public exists(key: string): Promise<boolean> {
    return this.count(key)
      .then(count => {
        return count >= 1 ? true : false;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      });
  }

  public getOne<T>(key: string): Promise<T> {
    return this.redisClient.get(key).catch((error: any) => {
      console.log(error);
      return error;
    });
  }

  public getAllKeys(wildcard: string): Promise<string[]> {
    return this.redisClient.keys(wildcard).catch((error: any) => {
      console.log(error);
      return error;
    });
  }

  public getAllKeyValue(wildcard: string): Promise<any[]> {
    return this.redisClient
      .keys(wildcard)
      .then(results => {
        return Promise.all(
          results.map(async key => {
            const value = await this.getOne(key);
            return { key, value };
          }),
        );
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      });
  }

  public set(key: string, value: any, expiration: number): Promise<any> {
    return this.redisClient
      .set(key, value)
      .then((reply: any) => {
        this.redisClient.expire(key, expiration);
        return reply;
      })
      .catch((error: any) => {
        console.log(error);
        return error;
      });
  }

  public deleteOne(key: string): Promise<number> {
    return this.redisClient.del(key).catch((error: any) => {
      console.log(error);
      return error;
    });
  }
}
