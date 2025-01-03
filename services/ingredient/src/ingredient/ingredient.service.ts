import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
import { RabbitMQBroker } from '@anchordiv/rabbitmq-broker';

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

    // Initialize RabbitMQ broker and publish ingredient-created event
    const broker = RabbitMQBroker.getInstance();
    await broker.init(this.rabbitMQUrl);

    // Publish ingredient creation event to the exchange
    const exchange = 'recipe.ingredients.inventory-updates';
    const routingKey = 'ingredients.create.new-ingredient';
    const message = JSON.stringify(data);
    const type = 'topic';
    await broker.publishToExchange(exchange, routingKey, message, type, {
      persistent: true,
    });
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
    return this.getIngredientById(id);
  }

  async deleteIngredient(id: string): Promise<void> {
    await this.ingredientRepo.delete({ id });
  }
}
