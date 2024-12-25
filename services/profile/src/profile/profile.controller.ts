import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { Profile } from './profile.entity';

@Controller('api/1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createProfile(@Body() profileDto: CreateProfileDto): Promise<Profile> {
    try {
      return await this.profileService.createProfile(profileDto);
    } catch (error) {
      if (error.code === '23505') {
        // Handle unique constraint errors
        throw new HttpException(
          `A profile with the provided username or email already exists.`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string): Promise<Profile> {
    try {
      return await this.profileService.getProfileById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileDto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      return await this.profileService.updateProfile(id, profileDto);
    } catch (error) {
      if (error.code === '23505') {
        // Handle unique constraint errors
        throw new HttpException(
          `A profile with the provided username or email already exists.`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: string): Promise<void> {
    try {
      await this.profileService.deleteProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
