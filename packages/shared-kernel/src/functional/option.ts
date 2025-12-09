import { UnwrapOptionError } from './errors';

export type Option<T> = Some<T> | None<T>;

/**
 * Extracts the inner value types from a tuple of Option values,
 * preserving positional types (supports readonly tuples).
 */
type ExtractSomeTuple<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends Option<infer V> ? V : never;
};

/**
 * Static utilities for constructing and working with `Option`.
 * Represents an optional value: either `Some(value)` or `None`.
 */
export const Option = {
  /**
   * Creates a `Some` wrapping the provided value.
   */
  some<T>(value: T): Option<T> {
    return new Some(value);
  },

  /**
   * Returns the shared `None` instance.
   * Generic typed via contextual inference.
   */
  none<T = never>(): Option<T> {
    return NONE as Option<T>;
  },

  /**
   * Converts a nullable value into an Option.
   * `null`/`undefined` → `None`, otherwise `Some(value)`.
   */
  fromNullable<T>(value: T | null | undefined): Option<T> {
    return value === null || value === undefined ? Option.none<T>() : new Some(value);
  },

  /**
   * Combines a homogeneous list of Options.
   * Returns `Some` of all values if every item is `Some`,
   * otherwise returns `None`.
   */
  combine<T>(options: readonly Option<T>[]): Option<T[]> {
    const values: T[] = [];
    for (const option of options) {
      if (option.isNone()) return Option.none();
      values.push(option.value);
    }
    return new Some(values);
  },

  /**
   * Combines a heterogeneous tuple of Options,
   * preserving the positional output types.
   */
  all<T extends readonly Option<unknown>[]>(options: T): Option<ExtractSomeTuple<T>> {
    const values: unknown[] = [];

    for (const option of options) {
      if (option.isNone()) return Option.none();
      values.push(option.value);
    }

    return new Some(values as ExtractSomeTuple<T>);
  },
};

/**
 * Base class providing the fluent API shared by `Some` and `None`.
 */
abstract class BaseOption<T> {
  abstract isSome(): this is Some<T>;
  abstract isNone(): this is None<T>;

  /**
   * Maps the value if `Some`; otherwise returns `None`.
   */
  map<U>(fn: (value: T) => U): Option<U> {
    return this.isSome() ? new Some(fn(this.value)) : Option.none();
  }

  /**
   * Chains computations returning an Option (`flatMap` / `bind`).
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return this.isSome() ? fn(this.value) : Option.none();
  }

  /**
   * Keeps the value only if it satisfies the predicate.
   */
  filter(predicate: (value: T) => boolean): Option<T> {
    return this.isSome() && predicate(this.value) ? this : Option.none();
  }

  /**
   * Pattern-matching helper for exhaustive handling of `Some` and `None`.
   */
  match<R>(handlers: { some: (value: T) => R; none: () => R }): R {
    return this.isSome() ? handlers.some(this.value) : handlers.none();
  }

  /**
   * Returns the value if `Some`, otherwise throws `UnwrapOptionError`.
   */
  unwrap(): T {
    if (this.isSome()) return this.value;
    throw new UnwrapOptionError();
  }

  /**
   * Returns the value if `Some`, otherwise the provided default.
   */
  unwrapOr(defaultValue: T): T {
    return this.isSome() ? this.value : defaultValue;
  }

  /**
   * Returns the value if `Some`, otherwise evaluates a fallback function.
   */
  unwrapOrElse(fn: () => T): T {
    return this.isSome() ? this.value : fn();
  }

  /**
   * Executes a side effect when `Some`.
   */
  tap(fn: (value: T) => void): this {
    if (this.isSome()) fn(this.value);
    return this;
  }

  /**
   * Converts the Option into a Promise.
   * Resolves with the value if `Some`; rejects if `None`.
   */
  toPromise(error?: Error): Promise<T> {
    return this.isSome()
      ? Promise.resolve(this.value)
      : Promise.reject(error || new UnwrapOptionError());
  }

  /**
   * Converts the Option to a nullable value.
   */
  toNullable(): T | null {
    return this.isSome() ? this.value : null;
  }

  /**
   * Structural equality check.
   * Allows comparing Options with different generic types.
   */
  equals(other: Option<unknown>): boolean {
    if (this.isSome() && other.isSome()) {
      return JSON.stringify(this.value) === JSON.stringify(other.value);
    }
    return this.isNone() && other.isNone();
  }

  toString(): string {
    return this.isSome() ? `Some(${JSON.stringify(this.value)})` : 'None';
  }
}

/**
 * Represents an Option containing a value.
 */
export class Some<T> extends BaseOption<T> {
  readonly kind = 'Some';

  constructor(public readonly value: T) {
    super();
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None<T> {
    return false;
  }
}

/**
 * Represents the absence of a value (`None`).
 * Implemented as a singleton, since all None instances are identical.
 */
export class None<T> extends BaseOption<T> {
  readonly kind = 'None';

  isSome(): this is Some<T> {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }
}

/**
 * Singleton instance used for all `None` values.
 */
const NONE = new None<unknown>();
