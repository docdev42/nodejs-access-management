import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailAlreadyExistsError } from './errors';
import { CreateUserDto } from './public/dto/create-user.dto';
import { NotFoundError } from 'src/common/errors';
import { UpdateUserDto } from './public/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new EmailAlreadyExistsError(createUserDto.email);
    }

    return this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        birthday: createUserDto.birthday,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  async findAll(dto: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 15 } = dto;
    return await this.prismaService.user.findMany({
      ...(search && {
        where: {
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
        },
      }),
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
