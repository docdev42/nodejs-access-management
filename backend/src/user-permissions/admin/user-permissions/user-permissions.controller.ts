import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AssignPermissionDto } from '../dto/assign-permission.dto';

@UseGuards(AuthGuard)
@Controller('admin/user-permissions')
export class UserPermissionsController {
  constructor(private userPermissionsService: UserPermissionsService) {}

  @Post()
  assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.userPermissionsService.assignPermission(assignPermissionDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.userPermissionsService.findByUser(userId);
  }

  @Get('permission/:permissionId')
  findByPermission(@Param('permissionId') permissionId: string) {
    return this.userPermissionsService.findByPermission(permissionId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPermissionsService.remove(id);
  }

  @Post(':id/revoke')
  revoke(@Param('id') id: string) {
    return this.userPermissionsService.revoke(id);
  }
}
