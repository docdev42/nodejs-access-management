import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letter, numbers and dashes',
  })
  slug: string;

  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  description: string;
}
