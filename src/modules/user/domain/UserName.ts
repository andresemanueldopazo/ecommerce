import { ValueObject } from '../../../shared/domain/ValueObject';
import { Guard } from '../../../shared/core/Guard';
import { DomainError } from '../../../shared/core/DomainError';

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

  public static create(props: UserNameProps): DomainError | UserName {
    const userNameResult = Guard.againstNullOrUndefined(
      props.userName,
      'userName',
    );
    if (!userNameResult.succeeded) {
      return new DomainError(userNameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      props.userName,
    );
    if (!minLengthResult.succeeded) {
      return new DomainError(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.userName);
    if (!maxLengthResult.succeeded) {
      return new DomainError(minLengthResult.message);
    }

    return new UserName(props);
  }
}
