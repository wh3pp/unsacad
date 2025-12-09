import { DomainEvent } from '@unsacad/shared-kernel';
import type { UserRole } from '../iam.types';

export interface UserCreatedPayload {
  email: string;
  username: string;
  role: UserRole;
}

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  get eventName(): string {
    return 'Iam.UserCreated';
  }
}
