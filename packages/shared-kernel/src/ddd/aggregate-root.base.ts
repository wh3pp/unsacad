import { Entity, type EntityProps } from './entity.base';
import type { DomainEvent } from './domain-event.base';
import type { UniqueEntityID } from './unique-entity-id';
import type { Mutable } from 'src/types/mutable.type';

/**
 * Base class for aggregate roots.
 * Aggregates wrap entities and collect domain events.
 */
export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {
  private _domainEvents: DomainEvent<unknown>[] = [];

  /**
   * Protected constructor delegating identity and props to the base Entity.
   */
  protected constructor(props: T, id?: UniqueEntityID) {
    super(props, id);
  }

  /** List of domain events recorded by this aggregate. */
  get domainEvents(): DomainEvent<unknown>[] {
    return this._domainEvents;
  }

  /**
   * Records a domain event produced by this aggregate.
   */
  protected addDomainEvent(domainEvent: DomainEvent<unknown>): void {
    this._domainEvents.push(domainEvent);
  }

  /**
   * Removes all recorded domain events.
   */
  clearEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Returns the recorded events and clears the internal list.
   * Useful for dispatching events after persistence.
   */
  pullEvents(): DomainEvent<unknown>[] {
    const events = this._domainEvents.slice();
    this.clearEvents();
    return events;
  }

  protected updateProps(newProps: Partial<T>): void {
    const props = this.props as Mutable<T>;
    Object.assign(props, newProps);
  }
}
