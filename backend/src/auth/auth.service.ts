import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvalidCredentialsError } from './errors';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new InvalidCredentialsError();
    }

    const payload = {
      sub: user.id,
      role : user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
