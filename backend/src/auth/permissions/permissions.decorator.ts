import { SetMetadata } from '@nestjs/common';
import { UserPermissions } from './permissions';

export const Permissions = (...args: UserPermissions[]) => SetMetadata('permissions', args);
