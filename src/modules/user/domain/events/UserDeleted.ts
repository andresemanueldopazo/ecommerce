import { User } from '../User';
import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export class UserDeleted implements IDomainEvent {
  public dateTimeOccurred: string;
  public user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date().toString();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
