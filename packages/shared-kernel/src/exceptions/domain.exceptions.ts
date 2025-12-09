import { ExceptionBase } from './exception.base';

const CODES = {
  DOMAIN_INVARIANT_VIOLATION: 'DomainInvariantViolationException',
} as const;

/**
 * Thrown when a domain invariant is violated, indicating a programming error.
 */
export class DomainInvariantViolationException extends ExceptionBase {
  readonly name = CODES.DOMAIN_INVARIANT_VIOLATION;
}
