import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements OnModuleInit {
  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    const admin = await this.prismaService.user.findFirst({
      where: {
        email: 'admin@user.com',
      },
    });

    if (!admin) {
      await this.prismaService.user.create({
        data: {
          email: 'admin@user.com',
          name: 'Bills Sama',
          password: bcrypt.hashSync('admin123', 10),
          birthday: '1000-12-25T00:00:00.000Z',
        },
      });
    }

    const manager = await this.prismaService.user.findFirst({
      where: {
        email: 'manager@user.com',
      },
    });

    if (!manager) {
      await this.prismaService.user.create({
        data: {
          email: 'manager@user.com',
          name: 'Sheng Long',
          password: bcrypt.hashSync('manager123', 10),
          birthday: '1500-03-23T00:00:00.000Z',
        },
      });
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        email: 'user@user.com',
      },
    });

    if (!user) {
      await this.prismaService.user.create({
        data: {
          email: 'user@user.com',
          name: 'Vegeta',
          password: bcrypt.hashSync('user123', 10),
          birthday: '1989-07-13T00:00:00.000Z',
        },
      });
    }
  }
}
