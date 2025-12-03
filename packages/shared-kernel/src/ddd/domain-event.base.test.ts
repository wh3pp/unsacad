import { describe, test, expect } from 'bun:test';
import { DomainEvent } from './domain-event.base';
import { UniqueEntityID } from './unique-entity-id';

class UserCreatedEvent extends DomainEvent {
  get eventName(): string {
    return 'UserCreatedEvent';
  }
}

describe('DomainEvent', () => {
  test('sets eventId as a unique string', () => {
    const aggId = new UniqueEntityID();
    const event = new UserCreatedEvent(aggId);

    expect(typeof event.eventId).toBe('string');
    expect(event.eventId.length).toBeGreaterThan(0);
  });

  test('eventId is unique on every instance', () => {
    const aggId = new UniqueEntityID();
    const e1 = new UserCreatedEvent(aggId);
    const e2 = new UserCreatedEvent(aggId);

    expect(e1.eventId).not.toBe(e2.eventId);
  });

  test('sets occurredOn to current time', () => {
    const aggId = new UniqueEntityID();
    const before = new Date();
    const event = new UserCreatedEvent(aggId);
    const after = new Date();

    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.occurredOn.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(event.occurredOn.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  test('assigns aggregateId correctly', () => {
    const aggId = new UniqueEntityID();
    const event = new UserCreatedEvent(aggId);

    expect(event.aggregateId).toBe(aggId);
  });

  test('eventName returns the subclass-defined name', () => {
    const aggId = new UniqueEntityID();
    const event = new UserCreatedEvent(aggId);

    expect(event.eventName).toBe('UserCreatedEvent');
  });

  test('initializes required event fields', () => {
    const aggId = new UniqueEntityID();
    const event = new UserCreatedEvent(aggId);

    expect(typeof event.eventId).toBe('string');
    expect(event.eventId.length).toBeGreaterThan(0);
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.aggregateId).toBe(aggId);
  });
});
