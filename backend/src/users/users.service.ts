import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailAlreadyExistsError } from './errors';
import { CreateUserDto } from './public/dto/create-user.dto';
import { NotFoundError } from 'src/common/errors';
import { UpdateUserDto } from './public/dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { formatUser, formatUsers } from 'src/utils/format-users';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new EmailAlreadyExistsError(createUserDto.email);
    }

    const logedAt = new Date();

    const newUser = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        birthday: createUserDto.birthday,
        password: bcrypt.hashSync(createUserDto.password, 10),
        lastLoginAt: logedAt,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const payload = {
      sub: newUser.id,
      name: newUser.name,
      lastLoginAt: logedAt,
      approved: newUser.approved,
      permissions: newUser.permissions.map((p) => ({
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

  async findAll(dto: {
    search?: string;
    permission?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, permission, page = 1, limit = 15 } = dto;
    const users = await this.prismaService.user.findMany({
      where: {
        ...(search && {
          OR: [
            {
              name: {
                mode: 'insensitive',
                contains: search,
              },
            },
            {
              email: {
                mode: 'insensitive',
                contains: search,
              },
            },
          ],
        }),
        ...(permission && {
          permissions: {
            some: {
              permission: {
                id: permission,
              },
              isRevoked: false,
              expiresAt: { gt: new Date() },
            },
          },
        }),
      },
      include: {
        permissions: {
          where: {
            isRevoked: false,
            expiresAt: { gt: new Date() },
          },
          include: {
            permission: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return formatUsers(users);
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      include: {
        permissions: {
          where: {
            isRevoked: false,
            expiresAt: { gt: new Date() },
          },
          include: {
            permission: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return formatUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    } else if (updateUserDto.email) {
      const duplicatedUser = await this.prismaService.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id },
        },
      });

      if (duplicatedUser) {
        throw new EmailAlreadyExistsError(updateUserDto.email);
      }
    }

    return await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        birthday: updateUserDto.birthday,
      },
    });
  }
}
