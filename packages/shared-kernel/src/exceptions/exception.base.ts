export interface SerializedException {
  message: string;
  code: string;
  stack?: string;
  cause?: unknown;
  metadata?: unknown;
}

export interface ExceptionOptions {
  cause?: unknown;
  metadata?: Record<string, unknown>;
}

export abstract class ExceptionBase extends Error {
  /** Exception identifier. */
  abstract override readonly name: string;

  /** Optional underlying cause. */
  public override readonly cause?: unknown;

  /** Extra metadata for debugging or logging. */
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, options?: ExceptionOptions) {
    super(message, { cause: options?.cause });

    this.cause = options?.cause;
    this.metadata = options?.metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the exception into a serializable JSON structure.
   */
  toJSON(): SerializedException {
    return {
      message: this.message,
      code: this.name,
      stack: this.stack,
      cause: this.cause,
      metadata: this.metadata,
    };
  }
}
