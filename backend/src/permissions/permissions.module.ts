import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminPermissionsController } from './admin/admin-permissions.controller';
import { AdminPermissionsService } from './admin/admin-permissions.service';
import { PermissionsController } from './public/permissions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto } from './admin/dto/create-permission.dto';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPermissionsController, PermissionsController],
  providers: [AdminPermissionsService],
})
export class PermissionsModule implements OnModuleInit {
  constructor(private prismaService: PrismaService) {}

  async onModuleInit() {
    const permissions: CreatePermissionDto[] = [
      {
        name: 'Admin',
        slug: 'admin',
        description: 'acesso a todos os recursos',
      },
      {
        name: 'Listar usuários',
        slug: 'listar-usuarios',
        description: 'acesso a lista de usuários',
      },
      {
        name: 'Ver usuário',
        slug: 'ver-usuario',
        description: 'acesso a view de usuário',
      },
      {
        name: 'Editar usuários',
        slug: 'editar-usuarios',
        description: 'acesso a edição de usuário',
      },
      {
        name: 'Aprovar usuários',
        slug: 'aprovar-usuarios',
        description: 'permite aprovar usuários',
      },
      {
        name: 'Remover usuários',
        slug: 'remover-usuarios',
        description: 'permite remover usuários',
      },
      {
        name: 'Adicionar permissão',
        slug: 'adicionar-permissao',
        description: 'permite adicionar permissões aos usuários',
      },
      {
        name: 'Listar permissões',
        slug: 'listar-permissoes',
        description: 'acesso a lista de permissões',
      },
      {
        name: 'Remover permissões',
        slug: 'remover-permissoes',
        description: 'permite remover permissões',
      },
      {
        name: 'Editar permissões',
        slug: 'editar-permissoes',
        description: 'permite editar permissões',
      },
    ];

    for (const createPermissionDto of permissions) {
      const originalPermission = await this.prismaService.permission.findFirst({
        where: {
          name: {
            mode: 'insensitive',
            contains: createPermissionDto.name,
          },
        },
      });

      if (!originalPermission) {
        await this.prismaService.permission.create({
          data: createPermissionDto,
        });
      }
    }
  }
}
