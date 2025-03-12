import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(dto: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = 15 } = dto;
    return await this.prismaService.permission.findMany({
      ...(name && {
        where: {
          name: {
            mode: 'insensitive',
            contains: name,
          },
        },
      }),
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: string) {
    const permission = await this.prismaService.permission.findFirst({
      where: {
        id: id,
      },
    });

    if (!permission) {
      throw new NotFoundError('Permission', id);
    }

    return permission;
  }
}
