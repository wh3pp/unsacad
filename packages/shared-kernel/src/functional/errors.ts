import { ExceptionBase } from '../exceptions/exception.base';

export class UnwrapOptionError extends ExceptionBase {
  readonly name = 'UnwrapOptionError';

  constructor(message = 'Attempted to unwrap an Option.None value') {
    super(message);
  }
}

export class UnwrapResultError extends ExceptionBase {
  readonly name = 'UnwrapResultError';

  constructor(message: string, cause?: unknown) {
    super(message, { cause });
  }
}
