import { UniqueEntityID } from './unique-entity-id';
import { Guard } from '../guard/guard';
import { ArgumentNotProvidedException } from '../exceptions';

export interface EntityProps {
  [key: string]: unknown;
}

interface Unpackable {
  unpack: () => unknown;
}

export abstract class Entity<T extends EntityProps> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this.validateProps(props);
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  static isEntity(value: unknown): value is Entity<EntityProps> {
    return value instanceof Entity;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    if (!Entity.isEntity(entity)) return false;

    return this._id.equals(entity._id);
  }

  toObject(): Record<string, unknown> {
    return {
      id: this._id.toString(),
      ...(Entity.serialize(this.props) as Record<string, unknown>),
    };
  }

  protected validateProps(props: T): void {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Entity props cannot be empty');
    }
    if (typeof props !== 'object') {
      throw new ArgumentNotProvidedException('Entity props must be an object');
    }
  }

  private static serialize(value: unknown): unknown {
    if (Entity.isEntity(value)) {
      return value.toObject();
    }

    if (Array.isArray(value)) {
      return value.map((v) => Entity.serialize(v));
    }

    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      if ('unpack' in value && typeof (value as Unpackable).unpack === 'function') {
        return Entity.serialize((value as Unpackable).unpack());
      }

      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = Entity.serialize(val);
      }
      return result;
    }

    return value;
  }
}
