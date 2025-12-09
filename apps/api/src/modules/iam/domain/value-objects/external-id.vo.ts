import { ValueObject, Result, Guard } from '@unsacad/shared-kernel';
import { InvalidExternalIdError } from '../iam.errors';

export class ExternalIdVO extends ValueObject<string> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(id: string): Result<ExternalIdVO, InvalidExternalIdError> {
    if (Guard.isEmpty(id)) {
      return Result.err(new InvalidExternalIdError(id));
    }

    return Result.ok(new ExternalIdVO({ value: id.trim() }));
  }
}
