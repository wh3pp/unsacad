import { describe, test, expect } from 'bun:test';
import { DomainEvent } from './domain-event.base';
import { UniqueEntityID } from './unique-entity-id';

class UserCreatedEvent extends DomainEvent {
  get eventName(): string {
    return 'UserCreatedEvent';
  }
}

describe('DomainEvent', () => {
  test('instantiation assigns eventId, occurredOn, and aggregateId', () => {
    const aggId = UniqueEntityID.generate();
    const event = new UserCreatedEvent(aggId);

    expect(event.aggregateId.toString()).toBe(aggId.toString());
    expect(typeof event.eventId).toBe('string');
    expect(event.occurredOn).toBeInstanceOf(Date);
  });

  test('eventName returns correct value', () => {
    const event = new UserCreatedEvent(UniqueEntityID.generate());
    expect(event.eventName).toBe('UserCreatedEvent');
  });
});
