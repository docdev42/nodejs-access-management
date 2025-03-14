import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../public/dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminUsersService } from './admin-users.service';
import { Permissions } from 'src/auth/permissions/permissions.decorator';
import { UserPermissions } from 'src/auth/permissions/permissions';
import { PermissionsGuard } from 'src/auth/permissions/permissions.guard';

@Permissions(UserPermissions.Admin, UserPermissions.Dashboard)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Permissions(UserPermissions.UsersView)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Permissions(UserPermissions.ApproveUsers)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminUsersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
