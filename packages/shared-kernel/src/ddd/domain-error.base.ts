export interface DomainErrorProps {
  /** Human-readable error message. */
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Base class for expected business-rule failures.
 * Designed to be returned through `Result.err()`.
 */
export abstract class DomainError {
  public readonly message: string;
  public readonly metadata?: Record<string, unknown>;
  public readonly name: string;

  constructor(message: string, metadata?: Record<string, unknown>) {
    this.message = message;
    this.metadata = metadata;
    this.name = this.constructor.name;
  }

  /** Provides a JSON-safe representation for logging or API responses. */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      metadata: this.metadata,
    };
  }
}
