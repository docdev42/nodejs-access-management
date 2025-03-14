import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permissions/permissions.decorator';
import { UserPermissions } from 'src/auth/permissions/permissions';
import { PermissionsGuard } from 'src/auth/permissions/permissions.guard';

@Permissions(UserPermissions.Admin, UserPermissions.ListPermissions)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
}
