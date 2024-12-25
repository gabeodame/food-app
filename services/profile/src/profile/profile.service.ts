import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(data: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(data);
    return this.profileRepository.save(profile);
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getProfileById(id);
    Object.assign(profile, data); // Merge updates
    return this.profileRepository.save(profile);
  }

  async deleteProfile(id: string): Promise<void> {
    const result = await this.profileRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Profile not found');
    }
  }
}
