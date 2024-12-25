import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
export declare class ProfileService {
    private readonly profileRepository;
    constructor(profileRepository: Repository<Profile>);
    createProfile(data: Partial<Profile>): Promise<Profile>;
    getProfileById(id: string): Promise<Profile>;
    updateProfile(id: string, data: Partial<Profile>): Promise<Profile>;
    deleteProfile(id: string): Promise<void>;
}
