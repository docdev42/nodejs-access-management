import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminPermissionsController } from '../admin/admin-permissions.controller';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPermissionsController, PermissionsController],
  providers: [AdminPermissionsService, PermissionsService],
})
export class PermissionsModule implements OnModuleInit {
  onModuleInit() {}
}
