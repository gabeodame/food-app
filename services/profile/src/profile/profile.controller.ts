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

  // UseGuards,
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
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { currentUser, requireAuth } from '@gogittix/common';

@ApiTags('profile')
@ApiBearerAuth('bearerAuth')
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

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the current user profile.',
    type: Profile,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Something went wrong',
  })
  async getProfileByCurrentUser(@Req() req: any): Promise<Profile> {
    console.log(req);
    console.log('currentUser from request', req?.currentUser);
    if (!req.currentUser || !req.currentUser.id) {
      // throw new HttpException(
      //   'User not authenticated',
      //   HttpStatus.UNAUTHORIZED,
      // );
      console.log('User not authenticated');
      return;
    }

    const userId = req.currentUser.id;
    console.log('Current User ID:', userId);
    return await this.profileService.getProfileCurrentUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
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

  @Get('by-email/:email')
  @ApiOperation({ summary: 'Get a profile by email' })
  @ApiResponse({
    status: HttpStatus.OK,
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
    status: HttpStatus.OK,
    description: 'Return a profile by ID.',
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
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      // if (error.code === '23505' && error.message.includes('email')) {
      //   throw new HttpException(
      //     'This email is already in use.',
      //     HttpStatus.CONFLICT,
      //   );
      // }
      // throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a profile by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Profile deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Something went wrong',
  })
  async deleteProfile(@Param('id') id: string): Promise<{ message: string }> {
    await this.profileService.deleteProfile(id);
    return { message: 'Profile deleted successfully' };
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    description: 'Profile image file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file upload request',
  })
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Invalid file type. Only JPG and PNG are allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new HttpException(
        'File size exceeds 5MB limit.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.profileService.uploadProfileImageToS3(id, file);
  }
}
