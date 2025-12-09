import type { EntityManager } from '@mikro-orm/postgresql';
import { Option } from '@unsacad/shared-kernel';
import type { UserAccount } from '../../domain';
import { type UserRepositoryPort } from '../../domain';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

export class MikroOrmUserRepository implements UserRepositoryPort {
  constructor(private readonly em: EntityManager) {}

  async save(user: UserAccount): Promise<void> {
    const ormEntity = UserMapper.toPersistence(user);
    await this.em.upsert(UserOrmEntity, ormEntity);
    await this.em.flush();
  }

  async delete(user: UserAccount): Promise<void> {
    const ref = this.em.getReference(UserOrmEntity, user.id.toString());
    await this.em.remove(ref).flush();
  }

  async findById(id: string): Promise<Option<UserAccount>> {
    const ormEntity = await this.em.findOne(UserOrmEntity, { id });
    if (!ormEntity) return Option.none();
    return Option.some(UserMapper.toDomain(ormEntity));
  }

  async findByUsername(username: string): Promise<Option<UserAccount>> {
    const ormEntity = await this.em.findOne(UserOrmEntity, { username });
    if (!ormEntity) return Option.none();
    return Option.some(UserMapper.toDomain(ormEntity));
  }

  async findByEmail(email: string): Promise<Option<UserAccount>> {
    const ormEntity = await this.em.findOne(UserOrmEntity, { email });
    if (!ormEntity) return Option.none();
    return Option.some(UserMapper.toDomain(ormEntity));
  }

  async findConflictingUser(email: string, username: string): Promise<Option<UserAccount>> {
    const ormEntity = await this.em.findOne(UserOrmEntity, {
      $or: [{ email }, { username }],
    });
    if (!ormEntity) return Option.none();
    return Option.some(UserMapper.toDomain(ormEntity));
  }
}
