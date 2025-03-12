import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionQueryDto } from './dto/permission-query.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(@Query() queryDto: PermissionQueryDto) {
    return this.permissionsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
}
