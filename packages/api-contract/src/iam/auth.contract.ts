export interface AuthTokenPayload {
  userId: string;
  username: string;
  role: string;
  exp?: number;
  iat?: number;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  tokens: AuthTokenResponse;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
