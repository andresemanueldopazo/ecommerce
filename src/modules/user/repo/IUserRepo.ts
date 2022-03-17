import { User } from '../domain/User';

export interface IUserRepo {
  exists(userEmail: string): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: string): Promise<User>;
  save(user: User): Promise<void>;
}
