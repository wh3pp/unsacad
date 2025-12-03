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
const NONE: None = { kind: OptionKind.None } as const;

export const Option = {
  /**
   * Creates an Option containing a value.
   */
  some<T>(value: T): Option<T> {
    return { kind: OptionKind.Some, value };
  },

  /**
   * Returns an empty Option (`None`).
   */
  none<T = never>(): Option<T> {
    return NONE as Option<T>;
  },

  /**
   * Type guard — true if the Option contains a value.
   */
  isSome<T>(opt: Option<T>): opt is Some<T> {
    return opt.kind === OptionKind.Some;
  },

  /**
   * Type guard — true if the Option is empty.
   */
  isNone<T>(opt: Option<T>): opt is None {
    return opt.kind === OptionKind.None;
  },

  /**
   * Returns the contained value or throws `UnwrapOptionError` if None.
   */
  unwrap<T>(opt: Option<T>): T {
    if (Option.isNone(opt)) {
      throw new UnwrapOptionError();
    }
    return opt.value;
  },

  /**
   * Returns the contained value or the provided default.
   */
  unwrapOr<T>(opt: Option<T>, defaultValue: T): T {
    return Option.isSome(opt) ? opt.value : defaultValue;
  },

  /**
   * Returns the value or computes a fallback via the provided function.
   */
  unwrapOrElse<T>(opt: Option<T>, fn: () => T): T {
    return Option.isSome(opt) ? opt.value : fn();
  },

  /**
   * Maps the contained value using the provided function.
   * Returns None if the Option is None.
   */
  map<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U> {
    return Option.isSome(opt) ? Option.some(fn(opt.value)) : Option.none();
  },

  /**
   * Flat-maps the Option, chaining computations that also return Option.
   */
  andThen<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U> {
    return Option.isSome(opt) ? fn(opt.value) : Option.none();
  },

  /**
   * Pattern matching for Option — runs the appropriate handler.
   */
  match<T, R>(
    opt: Option<T>,
    handlers: {
      readonly some: (value: T) => R;
      readonly none: () => R;
    },
  ): R {
    return Option.isSome(opt) ? handlers.some(opt.value) : handlers.none();
  },
};
