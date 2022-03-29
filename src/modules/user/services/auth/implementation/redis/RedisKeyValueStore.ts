import { client } from './clientRedis';
import { IKeyValueStore } from './IKeyValueStore';

export class RedisKeyValueStore implements IKeyValueStore {
  public async count(key: string): Promise<number> {
    const keys = await this.getKeysWithKeySubString(key);
    return keys.length;
  }

  public async exists(key: string): Promise<boolean> {
    const count = await this.count(key);
    return count >= 1 ? true : false;
  }

  public getOne(key: string): Promise<string | null> {
    return client.get(key);
  }

  public getKeysWithKeySubString(subString: string): Promise<string[]> {
    return client.keys(`*${subString}*`);
  }

  public async getKeysValuesWithKeySubString(
    subString: string,
  ): Promise<
    {
      key: string;
      value: string;
    }[]
  > {
    const results = await client.keys(`*${subString}*`);
    return await Promise.all(
      results.map(async key => {
        const value = await this.getOne(key) as string;
        return { key, value };
      }),
    );
  }

  public async set(key: string, value: any, expiration: number): Promise<void> {
    await client.set(key, value);
    client.expire(key, expiration);
  }

  public async deleteOne(key: string): Promise<void> {
    await client.del(key);
  }
}
