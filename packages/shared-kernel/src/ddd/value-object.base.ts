import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard/guard';

export type Primitive = string | number | boolean | Date;

export interface DomainPrimitive<T extends Primitive> {
  value: T;
}

export type ValueObjectProps<T> = T extends Primitive ? DomainPrimitive<T> : T;

/**
 * Base class for domain Value Objects in DDD.
 *
 * A Value Object:
 * - is immutable
 * - is compared by structure (not identity)
 * - enforces domain invariants inside `validate`
 * - may wrap primitives or complex structures
 */
export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  /**
   * Creates a new immutable Value Object and validates invariants.
   *
   * @throws ArgumentNotProvidedException if `props` or primitive values are empty
   */
  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = Object.freeze(props) as ValueObjectProps<T>;
  }

  /**
   * Domain-specific validation to be implemented by subclasses.
   */
  protected abstract validate(props: ValueObjectProps<T>): void;

  /**
   * Type guard that checks if the given object is a ValueObject instance.
   */
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  /**
   * Returns the raw value represented by the Value Object.
   */
  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value as T;
    }
    const unpacked = ValueObject.unpackRecursively(this.props);
    return Object.freeze(unpacked as T);
  }

  /**
   * Structural equality check.
   * Two ValueObjects are equal if their underlying properties match.
   */
  public equals(vo: ValueObject<T> | null | undefined): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.props === undefined) return false;
    if (this === vo) return true;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  /**
   * Ensures props and primitive values are not empty.
   *
   * @throws ArgumentNotProvidedException
   */
  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('ValueObject props cannot be empty');
    }
    if (this.isDomainPrimitive(props) && Guard.isEmpty(props.value)) {
      throw new ArgumentNotProvidedException('DomainPrimitive value cannot be empty');
    }
  }

  /**
   * Determines if the object is a primitive wrapper `{ value: T }`
   */
  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & Primitive> {
    return obj !== null && typeof obj === 'object' && 'value' in obj;
  }

  /**
   * Recursively unwraps nested VOs, arrays, and objects.
   */
  private static unpackRecursively(target: unknown): unknown {
    if (ValueObject.isValueObject(target)) {
      return target.unpack();
    }

    if (Array.isArray(target)) {
      return target.map((item) => ValueObject.unpackRecursively(item));
    }

    if (target !== null && typeof target === 'object' && !(target instanceof Date)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(target)) {
        const value = (target as Record<string, unknown>)[key];
        result[key] = ValueObject.unpackRecursively(value);
      }
      return result;
    }

    return target;
  }
}
