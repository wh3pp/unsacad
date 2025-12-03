import { Entity, type EntityProps } from './entity.base';
import type { DomainEvent } from './domain-event.base';

export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  pullEvents(): DomainEvent[] {
    const events = this._domainEvents.slice();
    this._domainEvents = [];
    return events;
  }
}
