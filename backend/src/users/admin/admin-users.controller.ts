import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../public/dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminUsersService } from './admin-users.service';

// decorator das permissões
// criar validação por permissao UserPermissionsGuard
@UseGuards(AuthGuard) // precisa estar logado
@Controller('admin/users')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminUsersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
