export interface IKeyValueStore {
  count(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  getOne(key: string): Promise<string | null>;
  getKeysWithKeySubString(subString: string): Promise<string[]>;
  getKeysValuesWithKeySubString(subString: string): Promise<any[]>;
  set(key: string, value: any, expiration: number): Promise<any>;
  deleteOne(key: string): Promise<void>;
}
