import { type RegisterUserRequest } from '@unsacad/api-contract';

export class CreateUserDto implements RegisterUserRequest {
  readonly username!: string;
  readonly email!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly role!: string;
  readonly password!: string;
}
