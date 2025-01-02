import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { Profile } from './profile.entity';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    createProfile(profileDto: CreateProfileDto): Promise<Profile>;
    getProfileById(id: string): Promise<Profile>;
    getProfileByEmail(email: string): Promise<Profile>;
    updateProfile(id: string, profileDto: UpdateProfileDto): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
    uploadProfileImage(id: string, file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
}
