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
 * - should be instantiated via a static factory method that returns a Result<T, E>
 */
export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  /**
   * Assumes validation occurred in the factory method.
   */
  protected constructor(props: ValueObjectProps<T>) {
    this.props = Object.freeze(props) as ValueObjectProps<T>;
  }

  /**
   * Returns the public value of the VO.
   */
  get value(): unknown {
    return this.unpack();
  }

  /**
   * Type guard that checks if the given object is a ValueObject instance.
   */
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  /**
   * Returns the raw value represented by the Value Object.
   */
  public unpack(): unknown {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value;
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
