import { describe, test, expect } from 'bun:test';
import { DomainEvent } from './domain-event.base';
import { UniqueEntityID } from './unique-entity-id';

interface UserPayload {
  email: string;
  username: string;
}

class TestEvent extends DomainEvent<UserPayload> {
  get eventName(): string {
    return 'Test.Event';
  }
}

describe('DomainEvent', () => {
  test('auto-generates eventId and occurredOn', () => {
    const aggregateId = UniqueEntityID.generate();
    const payload: UserPayload = { email: 'a@mail.com', username: 'john' };

    const event = new TestEvent({ aggregateId, payload });

    expect(event.aggregateId).toBe(aggregateId);
    expect(event.payload).toEqual(payload);
    expect(event.eventId).toBeDefined();
    expect(event.occurredOn).toBeInstanceOf(Date);
  });

  test('uses provided eventId and occurredOn', () => {
    const aggregateId = UniqueEntityID.generate();
    const payload: UserPayload = { email: 'b@mail.com', username: 'doe' };

    const customId = 'my-id';
    const customDate = new Date('2020-01-01T00:00:00Z');

    const event = new TestEvent({
      aggregateId,
      payload,
      eventId: customId,
      occurredOn: customDate,
    });

    expect(event.eventId).toBe(customId);
    expect(event.occurredOn).toBe(customDate);
  });

  test('exposes eventName defined in subclass', () => {
    const event = new TestEvent({
      aggregateId: UniqueEntityID.generate(),
      payload: { email: 'x@mail.com', username: 'test' },
    });

    expect(event.eventName).toBe('Test.Event');
  });

  test('toJSON serializes correctly', () => {
    const aggregateId = UniqueEntityID.generate();
    const payload = { email: 'json@mail.com', username: 'json' };

    const event = new TestEvent({ aggregateId, payload });

    const json = event.toJSON();

    expect(json).toEqual({
      eventId: event.eventId,
      aggregateId: event.aggregateId.toString(),
      eventName: 'Test.Event',
      occurredOn: event.occurredOn.toISOString(),
      payload,
    });
  });
});
