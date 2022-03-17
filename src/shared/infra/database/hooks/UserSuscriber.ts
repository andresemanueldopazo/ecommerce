import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { DomainEvents } from '../../../domain/events/DomainEvents';
import { UniqueEntityID } from '../../../domain/UniqueEntityID';
import { BaseUser } from '../../../../modules/user/infra/database/BaseUser';

const dispatchEventsCallback = (aggregateId: string) => {
  DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(aggregateId));
};

@EventSubscriber()
export class BaseUserSubscriber implements EntitySubscriberInterface<BaseUser> {
  listenTo() {
    return BaseUser;
  }

  afterInsert(event: InsertEvent<BaseUser>) {
    dispatchEventsCallback(event.entity.base_user_id);
  }

  afterUpdate(event: UpdateEvent<BaseUser>) {
    dispatchEventsCallback(event.entity.base_user_id);
  }

  afterRemove(event: RemoveEvent<BaseUser>) {
    dispatchEventsCallback(event.entity.base_user_id);
  }
}
