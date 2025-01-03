import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
import { RabbitMQBroker } from '@anchordiv/rabbitmq-broker';

type Type = 'topic' | 'direct' | 'fanout' | 'headers';

@Injectable()
export class IngredientService {
  private rabbitMQUrl: string;
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {
    this.rabbitMQUrl = process.env.RABBITMQ_URL!;
  }

  async createIngredient(data: Partial<Ingredient>): Promise<Ingredient> {
    const ingredient = this.ingredientRepo.create(data);

    // Publish the ingredient creation event
    await this.handlePublishOrUpdateIngredient('create', ingredient);

    return this.ingredientRepo.save(ingredient);
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientRepo.find();
  }

  async getIngredientById(id: string): Promise<Ingredient> {
    return this.ingredientRepo.findOne({ where: { id } });
  }

  async updateIngredient(
    id: string,
    data: Partial<Ingredient>,
  ): Promise<Ingredient> {
    await this.ingredientRepo.update({ id }, data);

    // Publish the ingredient update event
    await this.handlePublishOrUpdateIngredient('update', data);
    return this.getIngredientById(id);
  }

  async deleteIngredient(id: string): Promise<void> {
    await this.ingredientRepo.delete({ id });
  }

  // Business for handling published messages to the exchange
  async handlePublishOrUpdateIngredient(
    action: string = 'create',
    data: Partial<Ingredient>,
    exchange: string = 'recipe.ingredients.inventory-updates',
    routingKey: string = 'ingredients.create.ingredient',
    type: Type = 'topic',
  ): Promise<void> {
    // Initialize RabbitMQ broker and publish ingredient-created event
    const broker = RabbitMQBroker.getInstance();
    await broker.init(this.rabbitMQUrl);

    const message = JSON.stringify(data);

    if (action) {
      routingKey = `recipe.ingredients.${action}.ingredient`;
    }

    // Publish ingredient creation event to the exchange
    await broker.publishToExchange(exchange, routingKey, message, type, {
      persistent: true,
    });
  }
}
