export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenServicePort {
  generateAuthTokens(payload: TokenPayload): Promise<TokenResponse>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}
