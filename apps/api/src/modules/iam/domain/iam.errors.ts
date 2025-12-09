import { DomainError } from '@unsacad/shared-kernel';

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`El email '${email}' no es válido.`, { email });
  }
}

export class InvalidNameError extends DomainError {
  constructor(name: string) {
    super(`El nombre '${name}' es inválido.`, { name });
  }
}

export class InvalidPasswordError extends DomainError {
  constructor(reason: string) {
    super(`La contraseña es inválida: ${reason}`);
  }
}

export class InvalidRoleError extends DomainError {
  constructor(role: string) {
    super(`El rol '${role}' no es un rol permitido.`);
  }
}

export class InvalidExternalIdError extends DomainError {
  constructor(id: string) {
    super(`El ID externo '${id}' no es válido.`);
  }
}

export class UserAlreadyActiveError extends DomainError {
  constructor(id: string) {
    super(`El usuario ${id} ya se encuentra activo.`, {
      code: 'USER.ALREADY_ACTIVE',
      metadata: { id },
    });
  }
}

export class UserAlreadyInactiveError extends DomainError {
  constructor(id: string) {
    super(`El usuario ${id} ya se encuentra inactivo.`, {
      code: 'USER.ALREADY_INACTIVE',
      metadata: { id },
    });
  }
}
