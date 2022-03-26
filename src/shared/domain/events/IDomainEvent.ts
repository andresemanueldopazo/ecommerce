import { UniqueEntityID } from '../UniqueEntityID';

export interface IDomainEvent {
  dateTimeOccurred: string;
  getAggregateId(): UniqueEntityID;
}
