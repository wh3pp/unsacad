import { UnwrapResultError } from './errors';

export const enum ResultKind {
  Ok = 0,
  Err = 1,
}

export interface Ok<T> {
  readonly kind: ResultKind.Ok;
  readonly value: T;
}

export interface Err<E> {
  readonly kind: ResultKind.Err;
  readonly error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Functional Result type.
 *
 * Represents an operation that may succeed (`Ok`) or fail (`Err`).
 * Inspired by Rust's `Result<T, E>`.
 */
export const Result = {
  /**
   * Creates a successful `Ok` result.
   */
  ok<T, E = never>(value: T): Result<T, E> {
    return { kind: ResultKind.Ok, value };
  },

  /**
   * Creates a failed `Err` result.
   */
  err<T = never, E = unknown>(error: E): Result<T, E> {
    return { kind: ResultKind.Err, error };
  },

  /**
   * Type guard that checks whether the result is `Ok`.
   */
  isOk<T, E>(r: Result<T, E>): r is Ok<T> {
    return r.kind === ResultKind.Ok;
  },

  /**
   * Type guard that checks whether the result is `Err`.
   */
  isErr<T, E>(r: Result<T, E>): r is Err<E> {
    return r.kind === ResultKind.Err;
  },

  /**
   * Extracts the value from an `Ok`, or throws on `Err`.
   *
   * @throws UnwrapResultError if called on `Err`
   */
  unwrap<T, E>(r: Result<T, E>): T {
    if (Result.isErr(r)) {
      throw new UnwrapResultError('Attempted to unwrap a Result.Err', r.error);
    }
    return r.value;
  },

  /**
   * Extracts the error from an `Err`, or throws on `Ok`.
   *
   * @throws UnwrapResultError if called on `Ok`
   */
  unwrapErr<T, E>(r: Result<T, E>): E {
    if (Result.isOk(r)) {
      throw new UnwrapResultError('Attempted to unwrapErr a Result.Ok', r.value);
    }
    return r.error;
  },

  /**
   * Returns the wrapped value if `Ok`, otherwise returns the provided default.
   */
  unwrapOr<T, E>(r: Result<T, E>, defaultValue: T): T {
    return Result.isOk(r) ? r.value : defaultValue;
  },

  /**
   * Returns the wrapped value if `Ok`, otherwise computes a fallback value.
   */
  unwrapOrElse<T, E>(r: Result<T, E>, fn: (error: E) => T): T {
    return Result.isOk(r) ? r.value : fn(r.error);
  },

  /**
   * Maps the value in `Ok`, returning a new `Result`.
   * `Err` values are propagated unchanged.
   */
  map<T, U, E>(r: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return Result.isOk(r) ? Result.ok(fn(r.value)) : Result.err(r.error);
  },

  /**
   * Maps the error in `Err`, returning a new `Result`.
   * `Ok` values are propagated unchanged.
   */
  mapErr<T, E, F>(r: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    return Result.isErr(r) ? Result.err(fn(r.error)) : Result.ok(r.value);
  },

  /**
   * Chains computations by applying `fn` to the value of an `Ok`.
   * This is also known as `flatMap` or `bind`.
   */
  andThen<T, U, E>(r: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    return Result.isOk(r) ? fn(r.value) : Result.err(r.error);
  },

  /**
   * Pattern-matching for `Result`.
   * Similar to `match` expressions in Rust.
   */
  match<T, E, R>(r: Result<T, E>, handlers: { ok: (value: T) => R; err: (error: E) => R }): R {
    return Result.isOk(r) ? handlers.ok(r.value) : handlers.err(r.error);
  },

  /**
   * Wraps a function call in a `Result`.
   * Returns `Ok` if the function succeeds, `Err` if it throws.
   */
  fromThrowable<T, E = unknown>(fn: () => T): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (e) {
      return Result.err(e as E);
    }
  },

  /**
   * Converts a promise into a `Result`.
   * Resolves to `Ok` if the promise succeeds, `Err` if it rejects.
   */
  async fromPromise<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
      return Result.ok(await promise);
    } catch (e) {
      return Result.err(e as E);
    }
  },
};
