import { User } from '../domain/User';
import { UserDTO } from '../dtos/UserDTO';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { UserName } from '../domain/UserName';
import { UserPassword } from '../domain/UserPassword';
import { UserEmail } from '../domain/UserEmail';
import { AppError } from '../../../shared/core/AppError';

export class UserMap {
  public static toDTO(user: User): UserDTO {
    return {
      userName: user.userName.value,
      isEmailVerified: user.isEmailVerified,
      isSeller: user.isSeller,
      isDeleted: user.isDeleted,
    };
  }

  public static toDomain(raw: any): User | undefined {
    const userNameOrError = UserName.create({ userName: raw.userName });
    const userPasswordOrError = UserPassword.create({
      value: raw.user_password,
      hashed: true,
    });
    const userEmailOrError = UserEmail.create(raw.email);

    const userOrError = User.create({
        userName: userNameOrError as UserName,
        isSeller: raw.is_seller,
        isDeleted: raw.is_deleted,
        isEmailVerified: raw.is_email_verified,
        password: userPasswordOrError as UserPassword,
        email: userEmailOrError as UserEmail,
        lastLogin: ''
      },
      new UniqueEntityID(raw.base_user_id),
    );

    if (!(userOrError instanceof AppError)) {
      return userOrError;
    }
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string | null = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      base_user_id: user.userId.id.toString(),
      email: user.email.value,
      is_email_verified: user.isEmailVerified,
      userName: user.userName.value,
      user_password: password,
      is_seller: user.isSeller,
      is_deleted: user.isDeleted,
      last_login: user.lastLogin,
    };
  }
}
