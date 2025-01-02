import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './dto';
export declare class ProfileService implements OnApplicationBootstrap {
    private readonly profileRepository;
    private s3;
    constructor(profileRepository: Repository<Profile>);
    onApplicationBootstrap(): Promise<void>;
    private handleUserCreated;
    createProfile(data: CreateProfileDto): Promise<Profile>;
    getProfileById(id: string): Promise<Profile>;
    getProfileByEmail(email: string): Promise<Profile>;
    updateProfile(id: string, data: UpdateProfileDto): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
    uploadProfileImageToS3(id: string, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
}
