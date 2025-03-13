import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionSlugAlreadyExistsError } from '../errors';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class AdminPermissionsService {
  constructor(private prismaService: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.prismaService.permission.findFirst({
      where: {
        slug: createPermissionDto.slug,
      },
    });

    if (permission) {
      throw new PermissionSlugAlreadyExistsError(createPermissionDto.slug);
    }

    return this.prismaService.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return await this.prismaService.permission.findMany({
      include: {
        users: {
          where: {
            isRevoked: false,
            expiresAt: {
              gte: new Date(),
            },
          },
        },
      },
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

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.prismaService.permission.findFirst({
      where: {
        id: id,
      },
    });

    if (!permission) {
      throw new NotFoundError('Permission', id);
    } else if (updatePermissionDto.slug) {
      const duplicatePermission = await this.prismaService.permission.findFirst(
        {
          where: {
            slug: updatePermissionDto.slug,
            id: { not: id },
          },
        },
      );

      if (duplicatePermission) {
        throw new PermissionSlugAlreadyExistsError(updatePermissionDto.slug);
      }
    }

    return await this.prismaService.permission.update({
      where: {
        id: id,
      },
      data: updatePermissionDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} permission`;
  }
}
