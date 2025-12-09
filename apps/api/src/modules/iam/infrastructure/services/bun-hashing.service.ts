import type { HashingServicePort } from '../../application/ports';

export class BunHashingService implements HashingServicePort {
  async hash(plain: string): Promise<string> {
    return Bun.password.hash(plain, {
      algorithm: 'bcrypt',
      cost: 10,
    });
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return Bun.password.verify(plain, hashed);
  }
}
