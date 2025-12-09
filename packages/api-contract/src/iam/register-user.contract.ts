export interface RegisterUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
}
