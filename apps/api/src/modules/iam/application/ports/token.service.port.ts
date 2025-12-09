import type { AuthTokenPayload, AuthTokenResponse } from '@unsacad/api-contract';
import type { Option } from '@unsacad/shared-kernel';

export interface TokenServicePort {
  generateAuthTokens(payload: AuthTokenPayload): Promise<AuthTokenResponse>;
  verifyToken(token: string): Promise<Option<AuthTokenPayload>>;
}
