import type { Option, RepositoryPort } from '@unsacad/shared-kernel';
import type { UserAccount } from './user-account.entity';

export interface UserRepositoryPort extends RepositoryPort<UserAccount> {
  findByEmail(email: string): Promise<Option<UserAccount>>;
  findByUsername(username: string): Promise<Option<UserAccount>>;
}
