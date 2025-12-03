import { UniqueEntityID } from './unique-entity-id';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly aggregateId: UniqueEntityID;

  constructor(aggregateId: UniqueEntityID) {
    this.eventId = new UniqueEntityID().toString();
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
  }

  /**
   * e.g.: "UserCreatedEvent"
   */
  abstract get eventName(): string;
}
