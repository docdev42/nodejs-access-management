import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminPermissionsController } from './admin/admin-permissions.controller';
import { AdminPermissionsService } from './admin/admin-permissions.service';
import { PermissionsController } from './public/permissions.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPermissionsController, PermissionsController],
  providers: [AdminPermissionsService],
})
export class PermissionsModule implements OnModuleInit {
  onModuleInit() {}
}
