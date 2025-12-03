import { ExceptionBase, type ExceptionOptions } from './exception.base';
/**
 * Thrown when a domain invariant is violated.
 * Example: "A semester cannot end before it starts".
 */
export class DomainInvariantViolationException extends ExceptionBase {
  override readonly name = 'DomainInvariantViolationException';

  constructor(message: string, options?: ExceptionOptions) {
    super(message, options);
  }
}

/**
 * Thrown when an operation is attempted that the domain rules forbid.
 * Examples:
 * - Trying to enroll a student in a full lab section.
 * - Trying to register notes outside evaluation period.
 */
export class ForbiddenOperationException extends ExceptionBase {
  override readonly name = 'ForbiddenOperationException';

  constructor(message: string, options?: ExceptionOptions) {
    super(message, options);
  }
}
