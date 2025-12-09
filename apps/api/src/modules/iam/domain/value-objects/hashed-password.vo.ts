import { ValueObject, Result, Guard } from '@unsacad/shared-kernel';
import { InvalidPasswordError } from '../iam.errors';

export class HashedPasswordVO extends ValueObject<string> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(hashedValue: string): Result<HashedPasswordVO, InvalidPasswordError> {
    if (Guard.isEmpty(hashedValue)) {
      return Result.err(new InvalidPasswordError('El hash de contraseña no puede estar vacío.'));
    }
    return Result.ok(new HashedPasswordVO({ value: hashedValue }));
  }
}
