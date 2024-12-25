import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    createProfile(data: Partial<Profile>): Promise<Profile>;
    getProfileById(id: string): Promise<Profile>;
    updateProfile(id: string, data: Partial<Profile>): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
}
