import { UnwrapResultError } from './errors';

export type Result<T, E> = Ok<T, E> | Err<T, E>;

/**
 * Extracts the success-value types from a tuple of Result objects.
 * Supports readonly tuples.
 */
type ExtractOkTuple<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends Result<infer V, unknown> ? V : never;
};

/**
 * Extracts the union of error types from a tuple of Result objects.
 * Supports readonly tuples.
 */
type ExtractErrUnion<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends Result<unknown, infer E> ? E : never;
}[number];

/**
 * Factory and utility functions for constructing and combining Results.
 * Represents the outcome of an operation that can succeed (`Ok`) or fail (`Err`).
 */
export const Result = {
  /**
   * Creates a successful `Ok` containing the given value.
   */
  ok<T, E = never>(value: T): Result<T, E> {
    return new Ok(value);
  },

  /**
   * Creates a failed `Err` containing the given error.
   */
  err<T = never, E = unknown>(error: E): Result<T, E> {
    return new Err(error);
  },

  /**
   * Combines a homogeneous list of Results.
   * - All Ok → Ok of collected values
   * - Any Err → first Err encountered
   */
  combine<T, E>(results: readonly Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isErr()) return Result.err(result.error);
      values.push(result.value);
    }
    return Result.ok(values);
  },

  /**
   * Combines a heterogeneous tuple of Results while preserving
   * the positional types of each Ok value.
   */
  all<T extends readonly Result<unknown, unknown>[]>(
    results: T,
  ): Result<ExtractOkTuple<T>, ExtractErrUnion<T>> {
    const values: unknown[] = [];

    for (const result of results) {
      if (result.isErr()) {
        return Result.err(result.error as ExtractErrUnion<T>);
      }
      values.push(result.value);
    }

    return Result.ok(values as ExtractOkTuple<T>);
  },

  /**
   * Evaluates a function and captures exceptions as `Err`
   * instead of throwing.
   */
  fromThrowable<T, E = unknown>(fn: () => T): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (e) {
      return Result.err(e as E);
    }
  },

  /**
   * Wraps a Promise in a Result.
   * Resolves to `Ok(value)` or `Err(reason)`.
   */
  async fromPromise<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
      return Result.ok(await promise);
    } catch (e) {
      return Result.err(e as E);
    }
  },
};

/**
 * Base class providing the fluent API shared by `Ok` and `Err`.
 */
abstract class BaseResult<T, E> {
  abstract isOk(): this is Ok<T, E>;
  abstract isErr(): this is Err<T, E>;

  /**
   * Maps the success value when Ok; otherwise preserves Err.
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isOk()
      ? Result.ok(fn(this.value))
      : Result.err((this as unknown as Err<T, E>).error);
  }

  /**
   * Maps the error value when Err; otherwise preserves Ok.
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return this.isErr()
      ? Result.err(fn(this.error))
      : Result.ok((this as unknown as Ok<T, E>).value);
  }

  /**
   * Chains computations that return a Result (`flatMap` / `bind`).
   */
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    return this.isOk() ? fn(this.value) : Result.err((this as unknown as Err<T, E>).error);
  }

  /**
   * Exhaustively handles the Ok and Err cases.
   */
  match<R>(handlers: { ok: (value: T) => R; err: (error: E) => R }): R {
    return this.isOk()
      ? handlers.ok(this.value)
      : handlers.err((this as unknown as Err<T, E>).error);
  }

  /**
   * Returns the value if Ok; otherwise throws `UnwrapResultError`.
   */
  unwrap(): T {
    if (this.isOk()) return this.value;
    throw new UnwrapResultError(JSON.stringify((this as unknown as Err<T, E>).error));
  }

  /**
   * Returns the value if Ok; otherwise a provided default.
   */
  unwrapOr(defaultValue: T): T {
    return this.isOk() ? this.value : defaultValue;
  }

  /**
   * Returns the value if Ok; otherwise computes a fallback from the error.
   */
  unwrapOrElse(fn: (error: E) => T): T {
    return this.isOk() ? this.value : fn((this as unknown as Err<T, E>).error);
  }

  /**
   * Executes a side effect if Ok.
   */
  tap(fn: (value: T) => void): this {
    if (this.isOk()) fn(this.value);
    return this;
  }

  /**
   * Executes a side effect if Err.
   */
  tapErr(fn: (error: E) => void): this {
    if (this.isErr()) fn(this.error);
    return this;
  }

  /**
   * Converts the Result to a Promise.
   * - Ok → resolved(value)
   * - Err → rejected(error)
   */
  toPromise(): Promise<T> {
    if (this.isOk()) {
      return Promise.resolve(this.value);
    }

    const error = (this as unknown as Err<T, E>).error;

    if (error instanceof Error) {
      return Promise.reject(error);
    }

    return Promise.reject(
      new UnwrapResultError(
        typeof error === 'string' ? error : 'Result.Err rejected Promise',
        error,
      ),
    );
  }

  /**
   * Structural equality check.
   */
  equals(other: Result<unknown, unknown>): boolean {
    if (this.isOk() && other.isOk()) {
      return JSON.stringify(this.value) === JSON.stringify(other.value);
    }
    if (this.isErr() && other.isErr()) {
      return JSON.stringify(this.error) === JSON.stringify(other.error);
    }
    return false;
  }

  toString(): string {
    return this.isOk()
      ? `Ok(${JSON.stringify(this.value)})`
      : `Err(${JSON.stringify((this as unknown as Err<T, E>).error)})`;
  }
}

/**
 * Represents a successful result (`Ok`).
 */
export class Ok<T, E> extends BaseResult<T, E> {
  readonly kind = 'Ok';

  constructor(public readonly value: T) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }
}

/**
 * Represents a failed result (`Err`).
 */
export class Err<T, E> extends BaseResult<T, E> {
  readonly kind = 'Err';

  constructor(public readonly error: E) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }
}
