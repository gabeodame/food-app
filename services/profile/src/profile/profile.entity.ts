import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the user',
    required: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty({
    example: 'I am a software engineer.',
    description: 'The biography of the user',
  })
  @Column({ nullable: true })
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'The URL of the profile image',
  })
  @Column({ nullable: true })
  imageUrl?: string;
}
