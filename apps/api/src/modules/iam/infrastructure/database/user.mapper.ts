import { UniqueEntityID } from '@unsacad/shared-kernel';
import { UserAccount, type UserAccountProps } from '../../domain';
import {
  EmailVO,
  NameVO,
  UserRoleVO,
  ExternalIdVO,
  HashedPasswordVO,
  ActiveFlagVO,
} from '../../domain';
import { UserOrmEntity } from './user.orm-entity';
export const UserMapper = {
  toPersistence(domainEntity: UserAccount): UserOrmEntity {
    const ormEntity = new UserOrmEntity();

    ormEntity.id = domainEntity.id.toString();
    ormEntity.username = domainEntity.username;
    ormEntity.email = domainEntity.email;
    ormEntity.firstName = domainEntity.firstName;
    ormEntity.lastName = domainEntity.lastName;
    ormEntity.passwordHash = domainEntity.passwordHash;
    ormEntity.role = domainEntity.role;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;

    return ormEntity;
  },

  toDomain(ormEntity: UserOrmEntity): UserAccount {
    const props: UserAccountProps = {
      username: ExternalIdVO.create(ormEntity.username).unwrap(),
      email: EmailVO.create(ormEntity.email).unwrap(),
      firstName: NameVO.create(ormEntity.firstName).unwrap(),
      lastName: NameVO.create(ormEntity.lastName).unwrap(),
      password: HashedPasswordVO.create(ormEntity.passwordHash).unwrap(),
      role: UserRoleVO.create(ormEntity.role as string).unwrap(),
      isActive: ormEntity.isActive ? ActiveFlagVO.active() : ActiveFlagVO.inactive(),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    };

    const id = UniqueEntityID.create(ormEntity.id).unwrap();

    return UserAccount.unsafe(props, id);
  },
} as const;
