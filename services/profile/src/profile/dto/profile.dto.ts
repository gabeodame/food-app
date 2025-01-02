import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  email: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The biography of the user',
    example: 'I am a software engineer.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'The URL of the profile image',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class EmailDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  email: string;
}
