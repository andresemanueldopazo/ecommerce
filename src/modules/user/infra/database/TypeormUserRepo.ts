import { User } from '../../domain/User';
import { UserMap } from '../../mappers/UserMap';
import { BaseUser } from './BaseUser';
import { IUserRepo } from '../../repo/IUserRepo';
import { dataSource } from '../../../../shared/infra/database/dataSource';

export class TypeormUserRepo implements IUserRepo {
  async exists(userEmail: string): Promise<boolean> {
    const baseUser = await dataSource.getRepository(BaseUser).findOneBy({ email: userEmail });
    return !!baseUser=== true;
  }

  async getUserByUserName(userName: string): Promise<User | undefined> {
    const baseUser = await dataSource
      .getRepository(BaseUser)
      .findOneBy({ userName: userName });

    if (baseUser) {
      return UserMap.toDomain(baseUser);
    }
  }

  async getUserByUserId(userId: string): Promise<User | undefined> {
    const baseUser = await dataSource
      .getRepository(BaseUser)
      .findOneBy({ base_user_id: userId });

    if (baseUser) {
      return UserMap.toDomain(baseUser);
    }
  }

  async save(user: User): Promise<void> {
    const rawUser = await UserMap.toPersistence(user);
    await dataSource.getRepository(BaseUser).save(rawUser);
  }
}
