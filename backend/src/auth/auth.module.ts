import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/public/dto/create-user.dto';

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
    const users: CreateUserDto[] = [
      {
        email: 'admin@user.com',
        name: 'Prof. Carvalho',
        password: bcrypt.hashSync('admin123', 10),
        birthday: '1945-06-14T00:00:00.000Z',
        approved: true,
      },
      {
        email: 'misty@user.com',
        name: 'Misty',
        password: bcrypt.hashSync('misty123', 10),
        birthday: '1987-04-01T00:00:00.000Z',
        approved: true,
      },
      {
        email: 'ash@user.com',
        name: 'Ash',
        password: bcrypt.hashSync('ash123', 10),
        birthday: '1987-05-22T00:00:00.000Z',
        approved: true,
      },
    ];

    for (const createUserDto of users) {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: {
            contains: createUserDto.email,
          },
        },
      });

      if (!user) {
        await this.prismaService.user.create({
          data: createUserDto,
        });
      }
    }
  }
}
