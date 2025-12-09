export interface AuthTokenPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
