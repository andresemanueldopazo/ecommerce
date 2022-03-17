export interface IKeyValueStore {
  count(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  getOne<T>(key: string): Promise<T>;
  getAllKeys(wildcard: string): Promise<string[]>;
  getAllKeyValue(wildcard: string): Promise<any[]>;
  set(key: string, value: any, expiration: number): Promise<any>;
  deleteOne(key: string): Promise<number>;
}
