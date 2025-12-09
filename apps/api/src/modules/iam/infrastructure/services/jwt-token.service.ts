import type { AuthTokenPayload, AuthTokenResponse } from '@unsacad/api-contract';
import type { TokenServicePort } from '../../application/ports';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { Option, Result } from '@unsacad/shared-kernel';

const ACCESS_TOKEN_EXP = process.env['JWT_EXP'] ?? '15m';
const REFRESH_TOKEN_EXP = process.env['JWT_REFRESH_EXP'] ?? '7d';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev_secret';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'dev_refresh_secret';

const TOKEN_ISSUER = 'unsacad';
const TOKEN_AUDIENCE = 'unsacad-users';
const JWT_ALGORITHM = 'HS256';

export class JwtTokenService implements TokenServicePort {
  private readonly secret: Uint8Array;
  private readonly refreshSecret: Uint8Array;

  constructor(secret: string = JWT_SECRET, refreshSecret: string = JWT_REFRESH_SECRET) {
    this.secret = new TextEncoder().encode(secret);
    this.refreshSecret = new TextEncoder().encode(refreshSecret);
  }

  async generateAuthTokens(payload: AuthTokenPayload): Promise<AuthTokenResponse> {
    const accessToken = await this.signToken(payload, ACCESS_TOKEN_EXP, this.secret);
    const refreshToken = await this.signToken(
      { userId: payload.userId },
      REFRESH_TOKEN_EXP,
      this.refreshSecret,
    );

    return { accessToken, refreshToken, expiresIn: this.getUnixExpiration(ACCESS_TOKEN_EXP) };
  }

  async verifyToken(token: string): Promise<Option<AuthTokenPayload>> {
    return (await Result.fromPromise(jwtVerify(token, this.secret)))
      .map((r) => r.payload as unknown as AuthTokenPayload)
      .match({
        ok: (payload) => Option.some(payload),
        err: () => Option.none(),
      });
  }

  private async signToken(
    payload: object,
    expiresIn: string | number,
    secret: Uint8Array,
  ): Promise<string> {
    return await new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .setIssuer(TOKEN_ISSUER)
      .setAudience(TOKEN_AUDIENCE)
      .sign(secret);
  }

  private getUnixExpiration(expiresIn: string | number): number {
    const now = Math.floor(Date.now() / 1000);

    if (typeof expiresIn === 'number') {
      return now + expiresIn;
    }

    return now + this.parseDuration(expiresIn);
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
      return 15 * 60;
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 15 * 60;
    }
  }
}
