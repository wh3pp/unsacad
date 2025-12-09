import { randomUUID } from 'crypto';
import { ValueObject } from './value-object.base';
import { Result } from '../functional/result';
import { ArgumentInvalidException } from '../exceptions/validation.exceptions';

/**
 * Value Object representing a unique entity identifier (UUID v4).
 */
export class UniqueEntityID extends ValueObject<string> {
  private constructor(props: { value: string }) {
    super(props);
  }

  /**
   * Generates a new random UUID v4.
   */
  static generate(): UniqueEntityID {
    return new UniqueEntityID({ value: randomUUID() });
  }

  /**
   * Creates an ID from an existing string.
   * Returns a failure if the string is empty or blank.
   */
  static create(id: string): Result<UniqueEntityID, ArgumentInvalidException> {
    if (!id || id.trim().length === 0) {
      return Result.err(new ArgumentInvalidException('UniqueEntityID cannot be empty'));
    }
    return Result.ok(new UniqueEntityID({ value: id }));
  }

  /** Returns the ID as a string. */
  override toString(): string {
    return this.props.value;
  }

  /** Returns the raw string value of the ID. */
  toValue(): string {
    return this.props.value;
  }
}
