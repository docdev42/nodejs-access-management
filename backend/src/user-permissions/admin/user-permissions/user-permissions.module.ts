import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto } from '../dto/assign-permission.dto';

@Module({})
export class UserPermissionsModule implements OnModuleInit {
  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    const adminUser = await this.prismaService.user.findFirst({
      where: {
        email: 'admin@user.com',
      },
    });

    const adminPermission = await this.prismaService.permission.findFirst({
      where: {
        slug: 'admin',
      },
    });

    if (adminUser && adminPermission) {
      const userPermissions: AssignPermissionDto[] = [
        {
          userId: adminUser.id,
          permissionId: adminPermission.id,
          expiresAt: new Date().toISOString(),
        },
      ];

      for (const userPermissionDto of userPermissions) {
        await this.prismaService.userPermission.create({
          data: userPermissionDto,
        });
      }
    }
  }
}
