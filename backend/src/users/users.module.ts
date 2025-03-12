import { Module } from '@nestjs/common';
import { UsersController } from './public/users.controller';
import { UsersService } from './users.service';
import { AdminUsersController } from './admin/admin-users.controller';
import { AdminUsersService } from './admin/admin-users.service';

@Module({
  providers: [UsersService, AdminUsersService],
  controllers: [UsersController, AdminUsersController],
})
export class UsersModule {}
