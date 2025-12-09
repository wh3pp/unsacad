import { DomainError } from '@unsacad/shared-kernel';

export class UserAlreadyExistsError extends DomainError {
  constructor(identifier: string) {
    super(`El usuario con identificador '${identifier}' ya existe.`, {
      code: 'USER.ALREADY_EXISTS',
      httpStatus: 409,
    });
  }
}
