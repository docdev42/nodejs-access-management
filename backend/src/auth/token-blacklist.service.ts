import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Map<string, number> = new Map();

  constructor() {
    // Limpa tokens expirados periodicamente
    setInterval(() => this.cleanupExpiredTokens(), 3600000); // 1 hora
  }

  async addToBlacklist(token: string, expiryTime: number): Promise<void> {
    this.blacklistedTokens.set(token, expiryTime);
  }

  async isBlacklisted(token: string): Promise<boolean> {
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
