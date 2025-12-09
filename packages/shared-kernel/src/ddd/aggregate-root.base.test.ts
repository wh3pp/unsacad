import { describe, test, expect } from 'bun:test';
import { AggregateRoot } from './aggregate-root.base';
import { DomainEvent } from './domain-event.base';
import type { EntityProps } from './entity.base';

class TestEvent extends DomainEvent {
  get eventName() {
    return 'TestEvent';
  }
}

interface FakeProps extends EntityProps {
  name: string;
}

class FakeAggregate extends AggregateRoot<FakeProps> {
  static create(name: string) {
    return new FakeAggregate({ name });
  }

  triggerEvent() {
    this.addDomainEvent(new TestEvent(this.id));
  }
}

describe('AggregateRoot', () => {
  test('records domain events', () => {
    const agg = FakeAggregate.create('A');
    agg.triggerEvent();

    expect(agg.domainEvents.length).toBe(1);

    const event = agg.domainEvents[0]!;
    expect(event.eventName).toBe('TestEvent');
  });

  test('clearEvents() removes all events', () => {
    const agg = FakeAggregate.create('A');
    agg.triggerEvent();

    agg.clearEvents();
    expect(agg.domainEvents.length).toBe(0);
  });

  test('pullEvents() returns and clears events', () => {
    const agg = FakeAggregate.create('A');
    agg.triggerEvent();

    const events = agg.pullEvents();
    expect(events.length).toBe(1);
    expect(agg.domainEvents.length).toBe(0);
  });
});
