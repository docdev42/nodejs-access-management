import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { Public } from 'src/auth/public/decorators/public.decorator';
import { Permissions } from 'src/auth/permissions/permissions.decorator';
import { UserPermissions } from 'src/auth/permissions/permissions';
import { PermissionsGuard } from 'src/auth/permissions/permissions.guard';

@Permissions(UserPermissions.Admin)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Permissions(UserPermissions.ListUsers)
  @Get()
  findAll(@Query() queryDto: UserQueryDto) {
    return this.usersService.findAll(queryDto);
  }

  @Permissions(UserPermissions.UsersView)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Permissions(UserPermissions.EditUsers)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
