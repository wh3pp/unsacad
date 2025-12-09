import {
  AggregateRoot,
  DateUtil,
  Result,
  type DomainError,
  type EntityProps,
  type UniqueEntityID,
} from '@unsacad/shared-kernel';
import {
  ActiveFlagVO,
  EmailVO,
  ExternalIdVO,
  HashedPasswordVO,
  NameVO,
  UserRoleVO,
} from './value-objects';
import { UserCreatedEvent } from './events';
import type { UserRole } from './iam.types';
import { UserAlreadyActiveError, UserAlreadyInactiveError } from './iam.errors';

export interface UserAccountProps extends EntityProps {
  username: ExternalIdVO;
  firstName: NameVO;
  lastName: NameVO;
  email: EmailVO;
  password: HashedPasswordVO;
  role: UserRoleVO;
  isActive: ActiveFlagVO;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
}

export class UserAccount extends AggregateRoot<UserAccountProps> {
  static create(props: CreateUserProps, id?: UniqueEntityID): Result<UserAccount, DomainError> {
    const validationResult = Result.all([
      ExternalIdVO.create(props.username),
      EmailVO.create(props.email),
      NameVO.create(props.firstName),
      NameVO.create(props.lastName),
      HashedPasswordVO.create(props.passwordHash),
      UserRoleVO.create(props.role),
    ] as const);

    if (validationResult.isErr()) {
      return Result.err(validationResult.error);
    }

    const [username, email, firstName, lastName, password, role] = validationResult.unwrap();
    const now = DateUtil.now();

    const user = new UserAccount(
      {
        username,
        email,
        firstName,
        lastName,
        password,
        role,
        isActive: ActiveFlagVO.active(),
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    if (!id) {
      user.addDomainEvent(
        new UserCreatedEvent({
          aggregateId: user.id,
          payload: {
            email: email.value,
            username: username.value,
            role: role.value,
          },
        }),
      );
    }

    return Result.ok(user);
  }

  private constructor(props: UserAccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get username(): string {
    return this.props.username.value;
  }
  get email(): string {
    return this.props.email.value;
  }
  get firstName(): string {
    return this.props.firstName.value;
  }
  get lastName(): string {
    return this.props.lastName.value;
  }
  get fullName(): string {
    return `${this.props.firstName.value} ${this.props.lastName.value}`;
  }
  get role(): UserRole {
    return this.props.role.value;
  }
  get isActive(): boolean {
    return this.props.isActive.isActive();
  }
  get passwordHash(): string {
    return this.props.password.value;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changePassword(newHash: string): Result<void, DomainError> {
    const passResult = HashedPasswordVO.create(newHash);
    if (passResult.isErr()) return Result.err(passResult.error);

    this.updateProps({ password: passResult.unwrap(), updatedAt: DateUtil.now() });
    return Result.ok();
  }

  deactivate(): Result<void, DomainError> {
    if (this.props.isActive.isInactive()) {
      return Result.err(new UserAlreadyInactiveError(this.id.toString()));
    }
    this.updateProps({ isActive: ActiveFlagVO.inactive() });
    return Result.ok();
  }

  activate(): Result<void, DomainError> {
    if (this.props.isActive.isActive()) {
      return Result.err(new UserAlreadyActiveError(this.id.toString()));
    }
    this.updateProps({ isActive: ActiveFlagVO.active() });
    return Result.ok();
  }
}
