import { type DomainError, Result } from '@unsacad/shared-kernel';
import { UserAccount, type UserRepositoryPort } from '../../domain';
import type { HashingServicePort } from '../ports/hashing.service.port';
import type { CreateUserDto } from './create-user.dto';
import type { CreateUserResponseDto } from './create-user.response.dto';
import { UserAlreadyExistsError } from '../common';

export class CreateUserService {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly hashingService: HashingServicePort,
  ) {}

  async execute(dto: CreateUserDto): Promise<Result<CreateUserResponseDto, DomainError>> {
    const validationResult = await this.validateUserUniqueness(dto);
    if (validationResult.isErr()) return Result.err(validationResult.error);

    const passwordHash = await this.hashingService.hash(dto.password);
    const transactionResult = UserAccount.create({
      username: dto.username,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      passwordHash: passwordHash,
    });

    if (transactionResult.isErr()) {
      return Result.err(transactionResult.error);
    }

    const user = transactionResult.unwrap();
    await this.userRepo.save(user);

    return Result.ok<CreateUserResponseDto>({
      id: user.id.toString(),
      username: user.username,
    });
  }

  private async validateUserUniqueness(
    dto: CreateUserDto,
  ): Promise<Result<void, UserAlreadyExistsError>> {
    const conflictOption = await this.userRepo.findConflictingUser(dto.email, dto.username);

    if (conflictOption.isSome()) {
      const conflictUser = conflictOption.unwrap();

      const identifier = conflictUser.username === dto.username ? dto.username : dto.email;

      return Result.err(new UserAlreadyExistsError(identifier));
    }

    return Result.ok();
  }
}
