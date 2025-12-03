import { UnwrapOptionError } from './errors';

export const enum OptionKind {
  Some = 0,
  None = 1,
}

export interface Some<T> {
  readonly kind: OptionKind.Some;
  readonly value: T;
}

export interface None {
  readonly kind: OptionKind.None;
}

export type Option<T> = Some<T> | None;

// Singleton to avoid duplications
const NONE: None = { kind: OptionKind.None };

export const Option = {
  some<T>(value: T): Option<T> {
    return { kind: OptionKind.Some, value };
  },

  none<T = never>(): Option<T> {
    return NONE as Option<T>;
  },

  isSome<T>(opt: Option<T>): opt is Some<T> {
    return opt.kind === OptionKind.Some;
  },

  isNone<T>(opt: Option<T>): opt is None {
    return opt.kind === OptionKind.None;
  },

  unwrap<T>(opt: Option<T>): T {
    if (Option.isNone(opt)) {
      throw new UnwrapOptionError();
    }
    return opt.value;
  },

  unwrapOr<T>(opt: Option<T>, defaultValue: T): T {
    return Option.isSome(opt) ? opt.value : defaultValue;
  },

  map<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> {
    return Option.isSome(opt) ? Option.some(fn(opt.value)) : Option.none();
  },

  andThen<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
    return Option.isSome(opt) ? fn(opt.value) : Option.none();
  },

  match<T, R>(
    opt: Option<T>,
    handlers: {
      some: (value: T) => R;
      none: () => R;
    },
  ): R {
    return Option.isSome(opt) ? handlers.some(opt.value) : handlers.none();
  },
};
