import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionQueryDto } from './dto/permission-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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
