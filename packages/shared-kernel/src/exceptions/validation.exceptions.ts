import { ExceptionBase } from './exception.base';

const CODES = {
  ARGUMENT_INVALID: 'ArgumentInvalidException',
  ARGUMENT_NOT_PROVIDED: 'ArgumentNotProvidedException',
  NOT_FOUND: 'NotFoundException',
} as const;

/**
 * Thrown when an argument does not meet the required format or constraints.
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly name = CODES.ARGUMENT_INVALID;
}

/**
 * Thrown when a required argument is missing (null or undefined).
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly name = CODES.ARGUMENT_NOT_PROVIDED;
}

/**
 * Thrown when a required entity cannot be found and this is considered an error.
 * Note: For optional lookups, prefer returning `Option.none()` or `Result.err(new UserNotFoundError())` instead.
 */
export class NotFoundException extends ExceptionBase {
  readonly name = CODES.NOT_FOUND;

  constructor(message = 'Not found', metadata?: Record<string, unknown>) {
    super(message, { metadata });
  }
}
