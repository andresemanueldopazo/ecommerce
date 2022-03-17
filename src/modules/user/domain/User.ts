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
import { DomainError } from '../../../shared/core/DomainError';
import { UserLoggedIn } from './events/userLoggedIn';

interface UserProps {
  email: UserEmail;
  userName: UserName;
  password: UserPassword;
  isEmailVerified?: boolean;
  isSeller?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;
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

  get accessToken(): string {
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

  get lastLogin(): Date {
    return this.props.lastLogin;
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
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
  ): DomainError | User {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userName, argumentName: 'userName' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (!guardResult.succeeded) {
      return new DomainError(guardResult.message);
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
        isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
        isSeller: props.isSeller ? props.isSeller : false,
      },
      id,
    );

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return user;
  }
}
