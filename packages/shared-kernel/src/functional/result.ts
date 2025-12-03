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

export const Result = {
  ok<T, E = never>(value: T): Result<T, E> {
    return { kind: ResultKind.Ok, value };
  },

  err<T = never, E = unknown>(error: E): Result<T, E> {
    return { kind: ResultKind.Err, error };
  },

  isOk<T, E>(r: Result<T, E>): r is Ok<T> {
    return r.kind === ResultKind.Ok;
  },

  isErr<T, E>(r: Result<T, E>): r is Err<E> {
    return r.kind === ResultKind.Err;
  },

  unwrap<T, E>(r: Result<T, E>): T {
    if (Result.isErr(r)) {
      throw new UnwrapResultError('Attempted to unwrap a Result.Err', r.error);
    }
    return r.value;
  },

  unwrapErr<T, E>(r: Result<T, E>): E {
    if (Result.isOk(r)) {
      throw new UnwrapResultError('Attempted to unwrapErr a Result.Ok', r.value);
    }
    return r.error;
  },

  unwrapOr<T, E>(r: Result<T, E>, defaultValue: T): T {
    return Result.isOk(r) ? r.value : defaultValue;
  },

  unwrapOrElse<T, E>(r: Result<T, E>, fn: (error: E) => T): T {
    return Result.isOk(r) ? r.value : fn(r.error);
  },

  map<T, U, E>(r: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return Result.isOk(r) ? Result.ok(fn(r.value)) : Result.err(r.error);
  },

  mapErr<T, E, F>(r: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    return Result.isErr(r) ? Result.err(fn(r.error)) : Result.ok(r.value);
  },

  andThen<T, U, E>(r: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    return Result.isOk(r) ? fn(r.value) : Result.err(r.error);
  },

  match<T, E, R>(r: Result<T, E>, handlers: { ok: (value: T) => R; err: (error: E) => R }): R {
    return Result.isOk(r) ? handlers.ok(r.value) : handlers.err(r.error);
  },

  fromThrowable<T, E = unknown>(fn: () => T): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (e) {
      return Result.err(e as E);
    }
  },

  async fromPromise<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
      return Result.ok(await promise);
    } catch (e) {
      return Result.err(e as E);
    }
  },
};
