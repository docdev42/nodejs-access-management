import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  permission: string;

  @Min(1)
  @IsInt()
  @IsOptional()
  page: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  limit: number;
}
