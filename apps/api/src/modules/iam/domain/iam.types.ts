import type {
  ActiveFlagVO,
  EmailVO,
  ExternalKeyVO,
  HashedPasswordVO,
  NameVO,
  UserRoleVO,
} from './value-objects';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  SECRETARY = 'SECRETARY',
  ADMIN = 'ADMIN',
}

export interface UserAccountProps {
  externalId: ExternalKeyVO;
  email: EmailVO;
  firstName: NameVO;
  lastName: NameVO;
  role: UserRoleVO;
  passwordHash: HashedPasswordVO;
  isActive: ActiveFlagVO;
}
