import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl() // Validate as a URL
  imageUrl?: string; // Profile image
}

export class EmailDto {
  @IsEmail()
  email: string;
}
