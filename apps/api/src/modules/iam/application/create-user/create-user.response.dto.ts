import type { RegisterUserResponse } from '@unsacad/api-contract';

export class CreateUserResponseDto implements RegisterUserResponse {
  readonly id!: string;
  readonly username!: string;
}
