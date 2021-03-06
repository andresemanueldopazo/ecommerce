import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserId } from './UserId';
import { UserCreated } from './events/UserCreated';
import { UserPassword } from './UserPassword';
import { JWTToken, RefreshToken } from './jwt';
import { UserDeleted } from './events/UserDeleted';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Guard } from '../../../shared/core/Guard';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { AppError } from '../../../shared/core/AppError';
import { UserLoggedIn } from './events/userLoggedIn';

interface UserProps {
  email: UserEmail;
  userName: UserName;
  password: UserPassword;
  isEmailVerified: boolean;
  isSeller: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  lastLogin: string;
  isDeleted: boolean;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id);
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get userName(): UserName {
    return this.props.userName;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get accessToken(): string | undefined {
    return this.props.accessToken;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get isSeller(): boolean {
    return this.props.isSeller;
  }

  get lastLogin(): string | undefined {
    return this.props.lastLogin;
  }

  get refreshToken(): RefreshToken | undefined {
    return this.props.refreshToken;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date().toString().toString();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: UserProps,
    id?: UniqueEntityID,
  ): AppError | User {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userName, argumentName: 'userName' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (!guardResult.succeeded) {
      return new AppError(guardResult.message);
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
        isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
        isSeller: props.isSeller ? props.isSeller : false,
        lastLogin: props.lastLogin ? props.lastLogin : '',
      },
      id,
    );

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return user;
  }
}
