import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserErrors } from './CreateUserErrors';
import { Interactor } from '../../../../shared/core/Interactor';
import { UserEmail } from '../../domain/UserEmail';
import { UserPassword } from '../../domain/UserPassword';
import { UserName } from '../../domain/UserName';
import { User } from '../../domain/User';
import { IUserRepo } from '../../repo/IUserRepo';
import { AppError } from '../../../../shared/core/AppError';

export class CreateUserInteractor
  implements Interactor<CreateUserDTO, AppError | void> {
  constructor(private readonly userRepo: IUserRepo) {}

  async execute(request: CreateUserDTO): Promise<AppError | void> {
    const userEmailOrError = UserEmail.create(request.email);
    if (userEmailOrError instanceof AppError) return userEmailOrError;
    
    const userNameOrError = UserName.create({ userName: request.userName });
    if (userNameOrError instanceof AppError) return userNameOrError;

    const passwordOrError = UserPassword.create({
      value: request.password,
      hashed: false,
    });
    if (passwordOrError instanceof AppError) return passwordOrError;
    
    const userAlreadyExists = await this.userRepo.exists(
      userEmailOrError.value,
    );

    if (userAlreadyExists) {
      return new CreateUserErrors.EmailAlreadyExistsError(
        userEmailOrError.value,
      );
    }

    const userNameTaken = await this.userRepo.getUserByUserName(
      userNameOrError.value,
    );
    if (userNameTaken) {
      return new CreateUserErrors.UserNameTakenError(userNameOrError.value);
    }

    const userOrError = User.create({
      email: userEmailOrError,
      password: passwordOrError,
      userName: userNameOrError,
      isEmailVerified: false,
      isSeller: false,
      isDeleted: false,
      lastLogin: undefined,
    });
    if (userOrError instanceof AppError) return userOrError;
    await this.userRepo.save(userOrError);
  }
}
