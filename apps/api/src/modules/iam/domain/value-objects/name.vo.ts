import { ValueObject, Result, Guard } from '@unsacad/shared-kernel';
import { InvalidNameError } from '../iam.errors';

export class NameVO extends ValueObject<string> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(name: string): Result<NameVO, InvalidNameError> {
    if (Guard.isEmpty(name) || Guard.isShort(name, 2)) {
      return Result.err(new InvalidNameError(name));
    }
    return Result.ok(new NameVO({ value: name.trim().toUpperCase() }));
  }
}
