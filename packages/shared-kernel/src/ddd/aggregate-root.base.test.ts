import { describe, test, expect } from 'bun:test';
import { AggregateRoot } from './aggregate-root.base';
import { DomainEvent } from './domain-event.base';
import type { EntityProps } from './entity.base';
import { UniqueEntityID } from './unique-entity-id';

interface TestPayload {
  message: string;
}

class TestEvent extends DomainEvent<TestPayload> {
  get eventName() {
    return 'TestEvent';
  }
}

interface FakeProps extends EntityProps {
  name: string;
  count: number;
}

class FakeAggregate extends AggregateRoot<FakeProps> {
  static create(name: string) {
    return new FakeAggregate({ name, count: 0 });
  }

  triggerEvent() {
    this.addDomainEvent(
      new TestEvent({
        aggregateId: this.id,
        payload: { message: 'hello' },
      }),
    );
  }

  increment() {
    this.updateProps({ count: this.props.count + 1 });
  }
}

describe('AggregateRoot', () => {
  test('records domain events', () => {
    const agg = FakeAggregate.create('A');

    agg.triggerEvent();

    expect(agg.domainEvents.length).toBe(1);

    const event = agg.domainEvents[0]! as TestEvent;
    expect(event.eventName).toBe('TestEvent');
    expect(event.payload.message).toBe('hello');
    expect(event.aggregateId).toBeInstanceOf(UniqueEntityID);
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
    expect(events[0]!.eventName).toBe('TestEvent');
    expect(agg.domainEvents.length).toBe(0);
  });

  test('updateProps() mutates props safely', () => {
    const agg = FakeAggregate.create('A');

    expect(agg.props.count).toBe(0);

    agg.increment();

    expect(agg.props.count).toBe(1);
  });

  test('multiple events accumulate', () => {
    const agg = FakeAggregate.create('A');

    agg.triggerEvent();
    agg.triggerEvent();
    agg.triggerEvent();

    expect(agg.domainEvents.length).toBe(3);
  });
});
