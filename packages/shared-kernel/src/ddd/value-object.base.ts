import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard/guard';

export type Primitive = string | number | boolean | Date;

export interface DomainPrimitive<T extends Primitive> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitive ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = Object.freeze(props) as ValueObjectProps<T>;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value as T;
    }
    const unpacked = unpackRecursively(this.props);
    return Object.freeze(unpacked as T);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    if (this === vo) {
      return true;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('ValueObject props cannot be empty');
    }
    if (this.isDomainPrimitive(props) && Guard.isEmpty(props.value)) {
      throw new ArgumentNotProvidedException('DomainPrimitive value cannot be empty');
    }
  }

  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & Primitive> {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }
    return 'value' in obj;
  }
}

function unpackRecursively(target: unknown): unknown {
  if (ValueObject.isValueObject(target)) {
    return target.unpack();
  }

  if (Array.isArray(target)) {
    return target.map((item) => unpackRecursively(item));
  }

  if (target !== null && typeof target === 'object' && !(target instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(target)) {
      const value = (target as Record<string, unknown>)[key];
      result[key] = unpackRecursively(value);
    }
    return result;
  }

  return target;
}
