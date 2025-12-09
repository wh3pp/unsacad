import { ValueObject, Result } from '@unsacad/shared-kernel';
import { InvalidEmailError } from '../iam.errors';

export class EmailVO extends ValueObject<string> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(email: string): Result<EmailVO, InvalidEmailError> {
    const trimmed = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return Result.err(new InvalidEmailError(trimmed));
    }

    return Result.ok(new EmailVO({ value: trimmed }));
  }
}
