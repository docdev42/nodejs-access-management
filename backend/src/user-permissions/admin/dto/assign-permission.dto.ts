import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;
}
