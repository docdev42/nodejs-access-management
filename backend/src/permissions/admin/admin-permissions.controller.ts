import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AdminPermissionsService } from './admin-permissions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permissions/permissions.decorator';
import { UserPermissions } from 'src/auth/permissions/permissions';
import { PermissionsGuard } from 'src/auth/permissions/permissions.guard';

@Permissions(UserPermissions.Admin)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('admin/permissions')
export class AdminPermissionsController {
  constructor(private readonly permissionsService: AdminPermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
