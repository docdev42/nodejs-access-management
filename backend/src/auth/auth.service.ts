import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvalidCredentialsError } from './errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          where: {
            isRevoked: false,
            expiresAt: { gt: new Date() },
          },
        },
      },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new InvalidCredentialsError();
    }

    const logedAt = new Date();

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: logedAt,
      },
    });

    const payload = {
      sub: user.id,
      name: user.name,
      lastLoginAt: logedAt,
      approved: user.approved,
      permissions: user.permissions.map((p) => ({
        id: p.id,
        slug: p.permission.slug,
        expiresAt: p.expiresAt,
        isRevoked: p.isRevoked,
      })),
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token: access_token,
    };
  }

  logout(token) {
    this.tokenBlacklistService.addToBlacklist(
      token,
      this.jwtService.decode(token)['exp'],
    );

    return {
      message: 'Logout successful',
    };
  }
}
