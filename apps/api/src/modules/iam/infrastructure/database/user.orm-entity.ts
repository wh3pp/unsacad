import { Entity, PrimaryKey, Property, Enum, Unique } from '@mikro-orm/core';
import { UserRole } from '../../domain';

@Entity({ tableName: 'iam_users' })
export class UserOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ length: 50 })
  @Unique()
  username!: string;

  @Property({ length: 255 })
  @Unique()
  email!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ type: 'text' })
  passwordHash!: string;

  @Enum({ items: () => UserRole, type: 'string' })
  role!: UserRole;

  @Property()
  isActive!: boolean;

  @Property({ type: 'timestamptz' })
  createdAt!: Date;

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt!: Date;
}
