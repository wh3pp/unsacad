import { UniqueEntityID } from './unique-entity-id';

/**
 * Base class for all domain events.
 * Captures when the event occurred and which aggregate triggered it.
 */
export abstract class DomainEvent {
  /** Unique identifier for this event instance. */
  public readonly eventId: string;

  /** Timestamp indicating when the event occurred. */
  public readonly occurredOn: Date;

  /** Identifier of the aggregate that produced this event. */
  public readonly aggregateId: UniqueEntityID;

  constructor(aggregateId: UniqueEntityID) {
    this.eventId = UniqueEntityID.generate().toString();
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
  }

  /**
   * Human-readable event name, e.g. "UserCreatedEvent".
   */
  abstract get eventName(): string;
}
