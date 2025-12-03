import { ExceptionBase, type ExceptionOptions } from './exception.base';

/**
 * Common exception thrown when an argument is missing or empty.
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  override readonly name = 'ArgumentNotProvidedException';

  constructor(message: string, options?: ExceptionOptions) {
    super(message, options);
  }
}

/**
 * Common exception thrown when an argument has an invalid format or value.
 */
export class ArgumentInvalidException extends ExceptionBase {
  override readonly name = 'ArgumentInvalidException';

  constructor(message: string, options?: ExceptionOptions) {
    super(message, options);
  }
}

/**
 * Thrown when an entity cannot be found in the domain.
 * (Useful for aggregates and repository usage)
 */
export class NotFoundException extends ExceptionBase {
  override readonly name = 'NotFoundException';

  constructor(message: string, options?: ExceptionOptions) {
    super(message, options);
  }
}
