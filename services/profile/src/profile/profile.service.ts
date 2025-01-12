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
import { S3 } from 'aws-sdk';

@Injectable()
export class ProfileService implements OnApplicationBootstrap {
  private s3: S3;
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async onApplicationBootstrap() {
    const broker = RabbitMQBroker.getInstance();
    await broker.init(process.env.RABBITMQ_URL!);

    // Set up the consumer for the 'user-created' queue
    // await broker.consume('user-created', async (message) => {
    //   await this.handleUserCreated(message.content);
    // });

    const exchange = 'recipe.users.profile-updates';
    const mainQueue = 'profile-user-signup-queue';
    const dlx = 'profile-users-dlx';
    const dlq = 'profile-user-signup-dlq';
    const routingKey = 'users.signup.new-user';

    await broker.setupDeadLetterQueue(mainQueue, dlx, dlq);

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
    await broker.bindQueue(mainQueue, exchange, routingKey);

    await broker.consume(mainQueue, async (message) => {
      await this.handleUserCreated(message.content);
    });
  }

  // could this be merged with createProfile?
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

  async getProfileByEmail(email: string): Promise<Profile> {
    return this.profileRepository.findOne({ where: { email } });
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

  async uploadProfileImageToS3(
    id: string,
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    const profile = await this.getProfileById(id);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileKey = `profile-images/${profile.id}/profile-picture`;

    console.log('Uploading file:', fileKey);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
    };

    try {
      // Upload and overwrite the existing file
      const uploadResult = await this.s3.upload(params).promise();

      return {
        imageUrl: uploadResult.Location,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }
}
