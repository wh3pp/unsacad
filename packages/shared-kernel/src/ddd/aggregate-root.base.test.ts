import { describe, test, expect } from "bun:test";
import { AggregateRoot } from "./aggregate-root.base";
import { DomainEvent } from "./domain-event.base";
import type { EntityProps } from "./entity.base";

class TestEvent extends DomainEvent {
  override get eventName(): string {
    return "TestEvent";
  }
}

interface DummyProps extends EntityProps {
  name: string;
}

class DummyAggregate extends AggregateRoot<DummyProps> {
  override validate(): void {}

  triggerSomething(): void {
    const event = new TestEvent(this.id);
    this.addDomainEvent(event);
  }
}

describe("AggregateRoot", () => {
  test("initially has no domain events", () => {
    const agg = new DummyAggregate({ name: "A" });
    expect(agg.domainEvents.length).toBe(0);
  });

  test("addDomainEvent stores events internally", () => {
    const agg = new DummyAggregate({ name: "A" });
    agg.triggerSomething();

    expect(agg.domainEvents.length).toBe(1);
    expect(agg.domainEvents[0]).toBeInstanceOf(TestEvent);
  });

  test("clearEvents removes all domain events", () => {
    const agg = new DummyAggregate({ name: "A" });
    agg.triggerSomething();
    agg.triggerSomething();

    expect(agg.domainEvents.length).toBe(2);

    agg.clearEvents();
    expect(agg.domainEvents.length).toBe(0);
  });

  test("pullEvents returns events and clears them", () => {
    const agg = new DummyAggregate({ name: "A" });

    agg.triggerSomething();
    agg.triggerSomething();

    const pulled = agg.pullEvents();

    expect(pulled.length).toBe(2);
    expect(agg.domainEvents.length).toBe(0);
    expect(pulled[0]).toBeInstanceOf(TestEvent);
  });

  test("pullEvents returns a copy (not the internal array)", () => {
    const agg = new DummyAggregate({ name: "A" });

    agg.triggerSomething();
    const pulled = agg.pullEvents();

    pulled.push(new TestEvent(agg.id));

    expect(agg.domainEvents.length).toBe(0);
  });

  test("domainEvents getter exposes the internal events (read-only intent)", () => {
    const agg = new DummyAggregate({ name: "A" });
    agg.triggerSomething();

    const events = agg.domainEvents;
    expect(events.length).toBe(1);

    events.push(new TestEvent(agg.id));

    expect(agg.domainEvents.length).toBe(2);
  });
});

