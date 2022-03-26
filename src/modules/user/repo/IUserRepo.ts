import { User } from '../domain/User';

export interface IUserRepo {
  exists(userEmail: string): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User | undefined>;
  getUserByUserName(userName: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
