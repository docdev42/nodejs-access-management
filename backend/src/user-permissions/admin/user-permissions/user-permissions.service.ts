import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionDto } from '../dto/assign-permission.dto';
import { UserPermission } from '@prisma/client';

@Injectable()
export class UserPermissionsService {
  constructor(private prismaService: PrismaService) {}

  async assignPermission(assignPermissionDto: AssignPermissionDto) {
    const { userId, permissionId, expiresAt } = assignPermissionDto;

    return await this.prismaService.userPermission.create({
      data: {
        userId,
        permissionId,
        expiresAt: new Date(expiresAt),
        isRevoked: false,
      },
      include: {
        user: true,
        permission: true,
      },
    });
  }

  async findByUser(userId: string) {
    return await this.prismaService.userPermission.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        permission: true,
      },
    });
  }

  async findByPermission(permissionId: string) {
    return await this.prismaService.userPermission.findMany({
      where: {
        permissionId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prismaService.userPermission.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User Permission with ID ${id} not found`);
      }
      throw error;
    }
  }

  async revoke(id: string) {
    try {
      return await this.prismaService.userPermission.update({
        where: { id },
        data: { isRevoked: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User Permission with ID ${id} not found`);
      }
      throw error;
    }
  }
}
