import type { ActiveFlagVO, EmailVO, ExternalKeyVO, HashedPasswordVO, NameVO } from "./value-objects";

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
  role: UserRole;
  passwordHash: HashedPasswordVO;
  isActive: ActiveFlagVO;
}
