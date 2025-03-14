import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const permissions = await this.prismaService.permission.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return permissions.map((perm) => ({
      label: perm.name,
      value: perm.id,
    }));
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
