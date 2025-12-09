export class UnwrapOptionError extends Error {
  constructor(message?: string) {
    super(message || 'Attempted to unwrap an Option.None value');
    this.name = 'UnwrapOptionError';
  }
}

export class UnwrapResultError extends Error {
  constructor(message?: string, cause?: unknown) {
    super(message || 'Attempted to unwrap a Result.Err value', { cause });
    this.name = 'UnwrapResultError';

    if (cause && !this.cause) {
      (this as unknown as { cause: unknown }).cause = cause;
    }
  }
}
