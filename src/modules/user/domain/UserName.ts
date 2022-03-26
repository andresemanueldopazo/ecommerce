import { ValueObject } from '../../../shared/domain/ValueObject';
import { Guard } from '../../../shared/core/Guard';
import { AppError } from '../../../shared/core/AppError';

interface UserNameProps {
  userName: string;
}

export class UserName extends ValueObject<UserNameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value(): string {
    return this.props.userName;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(props: UserNameProps): AppError | UserName {
    const userNameResult = Guard.againstNullOrUndefined(
      props.userName,
      'userName',
    );
    if (!userNameResult.succeeded) {
      return new AppError(userNameResult.message);
    }

    // const minLengthResult = Guard.againstAtLeast(
    //   this.minLength,
    //   props.userName,
    // );
    // if (!minLengthResult.succeeded) {
    //   return new AppError(minLengthResult.message);
    // }

    // const maxLengthResult = Guard.againstAtMost(this.maxLength, props.userName);
    // if (!maxLengthResult.succeeded) {
    //   return new AppError(minLengthResult.message);
    // }

    return new UserName(props);
  }
}
