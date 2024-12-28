import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { RabbitMQBroker } from '@anchordiv/rabbitmq-broker';

@Injectable()
export class ProfileService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async onApplicationBootstrap() {
    const broker = RabbitMQBroker.getInstance();
    await broker.init(process.env.RABBITMQ_URL!);

    // Set up the consumer for the 'user-created' queue
    // await broker.consume('user-created', async (message) => {
    //   await this.handleUserCreated(message.content);
    // });

    const exchange = 'recipe.users.profile-updates';
    const mainQue = 'user-signup-queue';
    const dlx = 'recipe.users.dlx';
    const dlq = 'user-signup-dlq';

    const routingKey = 'users.signup.new-user';

    await broker.setupDeadLetterQueue(mainQue, dlx, dlq);

    // Process dead-lettered messages
    await broker.consume(dlq, async (message) => {
      try {
        console.log('Dead-lettered message:', message.content.toString());
        await this.handleUserCreated(message.content);
      } catch (error) {
        console.error('Error handling dead-lettered message:', error);
        // Decide on further actions, such as logging or alerting
      }
    });

    // Bind Main Queue to Exchange
    await broker.assertExchange(exchange, 'topic');
    await broker.bindQueue(mainQue, exchange, routingKey);

    await broker.consume(mainQue, async (message) => {
      await this.handleUserCreated(message.content);
    });
  }

  private async handleUserCreated(message: Buffer): Promise<void> {
    try {
      const data: CreateProfileDto = JSON.parse(message.toString());
      console.log('Message received:', data);

      // Process the message: Create a new profile
      const profile = this.profileRepository.create(data);
      await this.profileRepository.save(profile);
    } catch (error) {
      console.error('Error handling user-created message:', error);
    }
  }

  // Remaining ProfileService logic
  async createProfile(data: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(data);
    return this.profileRepository.save(profile);
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
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
