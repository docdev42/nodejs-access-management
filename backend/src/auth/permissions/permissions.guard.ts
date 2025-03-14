import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.getAllAndMerge('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!user.approved) return false;

    if (!requiredPermissions) {
      return true;
    }

    return requiredPermissions.some((requiredPermission) =>
      user.permissions?.some(
        (permission) =>
          permission.slug === requiredPermission &&
          !permission.isRevoked &&
          new Date(permission.expiresAt) > new Date(),
      ),
    );
  }
}
