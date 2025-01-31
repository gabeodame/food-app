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
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

import { Profile } from './profile.entity';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('profile')
@Controller('api/1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({
    status: 201,
    description: 'The profile has been successfully created.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
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

  @Get('/')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a profile by ID.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getProfileBycurrentUser(
    // @Param('id') id: string,
    @Req() req: any,
  ): Promise<Profile> {
    try {
      // const userId = id;
      return await this.profileService.getProfileCurrentUser(req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a profile by ID.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getProfileById(@Param('id') id: string): Promise<Profile> {
    try {
      const userId = id;
      return await this.profileService.getProfileById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get a profile by email' })
  @ApiResponse({
    status: 200,
    description: 'Return a profile by email.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getProfileByEmail(@Param('email') email: string): Promise<Profile> {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.profileService.getProfileByEmail(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the updated profile.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  @ApiBody({
    description: 'Partial update of a profile',
    examples: {
      example1: {
        summary: 'Update firstName and lastName',
        value: {
          firstName: 'John',
          lastName: 'Foe',
        },
      },
      example2: {
        summary: 'Update bio',
        value: {
          bio: 'A software engineer with a passion for cooking.',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Delete a profile by ID' })
  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async deleteProfile(@Param('id') id: string): Promise<void> {
    try {
      await this.profileService.deleteProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiParam({
    name: 'id',
    description: 'The ID of the entity to associate with the uploaded file',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    description: 'File to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Binary indicates a file upload
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File successfully uploaded',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file upload request',
  })
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    try {
      return await this.profileService.uploadProfileImageToS3(id, file);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
