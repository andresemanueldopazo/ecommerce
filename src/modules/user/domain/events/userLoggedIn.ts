import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { User } from '../User';

export class UserLoggedIn implements IDomainEvent {
  public dateTimeOccurred: string;
  public user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date().toString();
    this.user = user;
  }

  public getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
