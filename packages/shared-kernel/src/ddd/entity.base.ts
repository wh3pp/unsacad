import { UniqueEntityID } from './unique-entity-id';

const ENTITY_BRAND = Symbol('__ENTITY__');

export interface EntityProps {
  [key: string]: unknown;
}

export interface Serializable {
  toObject(): unknown;
}

/**
 * Base class for domain entities.
 * Entities have:
 * - A unique identity (`UniqueEntityID`)
 * - Mutable behavior through methods (props themselves are frozen)
 * - Equality based on identity, not properties
 */
export abstract class Entity<T extends EntityProps> implements Serializable {
  protected readonly _id: UniqueEntityID;
  public readonly props: Readonly<T>;

  /** Nominal typing marker for entity detection. */
  public readonly [ENTITY_BRAND]: boolean = true;

  /**
   * Assigns a new UUID v4 if no ID is provided.
   * Does NOT perform validation.
   */
  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? UniqueEntityID.generate();
    this.props = Object.freeze({ ...props });
  }

  /** Returns the entity's unique identifier. */
  get id(): UniqueEntityID {
    return this._id;
  }

  /** Type guard to detect Entity instances via structural branding. */
  static isEntity(v: unknown): v is Entity<EntityProps> {
    return typeof v === 'object' && v !== null && ENTITY_BRAND in v;
  }

  /**
   * Compares entities by identity (ID equality).
   */
  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) return false;
    if (this === object) return true;
    if (!Entity.isEntity(object)) return false;
    return this._id.equals(object._id);
  }

  /**
   * Converts the entity into a plain object.
   * Useful for persistence or DTO transformation.
   */
  public toObject(): Record<string, unknown> {
    const plainProps = this.convertPropsToPlainObject(this.props);
    return {
      id: this._id.toString(),
      ...plainProps,
    };
  }

  private convertPropsToPlainObject(props: EntityProps): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      result[key] = this.serializeValue(props[key]);
    }
    return result;
  }

  private serializeValue(value: unknown): unknown {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map((v) => this.serializeValue(v));
    if (this.isSerializable(value)) return value.toObject();
    if (typeof value === 'object' && value !== null) {
      return this.convertPropsToPlainObject(value as EntityProps);
    }
    return value;
  }

  private isSerializable(value: unknown): value is Serializable {
    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate === 'object' &&
      candidate !== null &&
      'toObject' in candidate &&
      typeof candidate['toObject'] === 'function'
    );
  }
}
