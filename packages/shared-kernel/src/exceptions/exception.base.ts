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
  abstract override readonly name: string;
  public override readonly cause?: unknown;
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, options?: ExceptionOptions) {
    super(message, { cause: options?.cause });

    this.cause = options?.cause;
    this.metadata = options?.metadata;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

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
