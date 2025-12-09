import { ValueObject, Result } from '@unsacad/shared-kernel';
import { UserRole } from '../iam.types';
import { InvalidRoleError } from '../iam.errors';

export class UserRoleVO extends ValueObject<UserRole> {
  private constructor(props: { value: UserRole }) {
    super(props);
  }

  static create(role: string): Result<UserRoleVO, InvalidRoleError> {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return Result.err(new InvalidRoleError(role));
    }
    return Result.ok(new UserRoleVO({ value: role as UserRole }));
  }
}
