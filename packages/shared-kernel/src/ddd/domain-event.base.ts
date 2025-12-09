import { DateUtil } from 'src/utils/date.util';
import { UniqueEntityID } from './unique-entity-id';

export interface DomainEventProps<T> {
  aggregateId: UniqueEntityID;
  payload: T;
  eventId?: string;
  occurredOn?: Date;
}

/**
 * Base class for domain events
 */
export abstract class DomainEvent<T = Record<string, unknown>> {
  /** Unique identifier for this event instance. */
  public readonly eventId: string;
  /** Aggregate ID that triggered this event. */
  public readonly aggregateId: UniqueEntityID;
  /** Event-specific data. */
  public readonly payload: T;
  /** Timestamp of when the event occurred. */
  public readonly occurredOn: Date;

  constructor(props: DomainEventProps<T>) {
    this.aggregateId = props.aggregateId;
    this.payload = props.payload;
    this.eventId = props.eventId ?? UniqueEntityID.generate().toString();
    this.occurredOn = props.occurredOn ?? DateUtil.now();
  }

  /**
   * Fully qualified event name used by event bus / logging.
   * Example: `"Iam.UserCreated"`.
   */
  abstract get eventName(): string;

  /**
   * Standard JSON representation for event serialization.
   */
  public toJSON(): object {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId.toString(),
      eventName: this.eventName,
      occurredOn: this.occurredOn.toISOString(),
      payload: this.payload,
    };
  }
}
