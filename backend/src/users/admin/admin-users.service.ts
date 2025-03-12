import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from '../public/dto/update-user.dto';
import { NotFoundError } from 'src/common/errors';
import { EmailAlreadyExistsError } from '../errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private prismaService: PrismaService) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    } else if (updateUserDto.email) {
      const duplicatedEmail = await this.prismaService.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id },
        },
      });

      if (duplicatedEmail) {
        throw new EmailAlreadyExistsError(updateUserDto.email);
      }
    }

    return await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }
}
