import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/public/permissions.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UserPermissionsController } from './user-permissions/admin/user-permissions/user-permissions.controller';
import { UserPermissionsService } from './user-permissions/admin/user-permissions/user-permissions.service';
import { BlacklistModule } from './auth/blacklist.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    BlacklistModule,
  ],
  controllers: [AppController, UserPermissionsController],
  providers: [AppService, UserPermissionsService],
})
export class AppModule {}
