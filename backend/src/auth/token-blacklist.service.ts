import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Map<string, number> = new Map();

  constructor() {
    setInterval(() => this.cleanupExpiredTokens(), 3600000); // 1 hora
  }

  addToBlacklist(token: string, expiryTime: number): void {
    this.blacklistedTokens.set(token, expiryTime);
  }

  isBlacklisted(token: string): boolean {
    if (!this.blacklistedTokens.has(token)) {
      return false;
    }

    const expiry = this.blacklistedTokens.get(token);
    const now = Math.floor(Date.now() / 1000);

    if (expiry && expiry < now) {
      this.blacklistedTokens.delete(token);
      return false;
    }

    return true;
  }

  private cleanupExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [token, expiry] of this.blacklistedTokens.entries()) {
      if (expiry < now) {
        this.blacklistedTokens.delete(token);
      }
    }
  }
}
