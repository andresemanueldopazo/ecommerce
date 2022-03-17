import { User } from '../../domain/User';
import { UserMap } from '../../mappers/UserMap';
import { BaseUser } from './BaseUser';
import { IUserRepo } from '../../repo/IUserRepo';

export class TypeormUserRepo implements IUserRepo {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async exists(userEmail: string): Promise<boolean> {
    const user = await this.client
      .getRepository(BaseUser)
      .findOne({ email: userEmail });

    return !!user === true;
  }

  async getUserByUserName(userName: string): Promise<User> {
    const user = await this.client
      .getRepository(BaseUser)
      .findOne({ userName: userName });

    if (!user) return;

    return UserMap.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.client
      .getRepository(BaseUser)
      .findOne({ base_user_id: userId });

    if (!user) return;

    return UserMap.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const rawUser = await UserMap.toPersistence(user);
    await this.client.getRepository(BaseUser).save(rawUser);
  }
}
