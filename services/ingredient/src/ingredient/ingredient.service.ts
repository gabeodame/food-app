import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
import { RabbitMQBroker } from '@anchordiv/rabbitmq-broker';
import { BadRequestError, NotAuthorizedError } from '@gogittix/common';
// import { NotAuthorizedError } from '@gogittix/common';

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

  // Fetch all ingredients
  async getAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientRepo.find();
  }

  // Fetch multiple ingredients by IDs
  async getIngredientById(id: number): Promise<Ingredient> {
    return this.ingredientRepo.findOne({ where: { id } });
  }

  // Fetch multiple ingredients by IDs
  async getIngredientsByIds(ids: number[]): Promise<Ingredient[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestError('At least one ingredient ID is required.');
    }

    return this.ingredientRepo.find({
      where: { id: In(ids) },
    });
  }

  async createIngredient(
    data: Partial<Ingredient>,
    req: any,
  ): Promise<Ingredient> {
    console.log('Create ingredient req:', req);

    const ingredientData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.currentUser.id,
    };
    try {
      const isExistingIngredient = await this.ingredientRepo.findOne({
        where: { name: ingredientData.name },
      });

      if (isExistingIngredient) {
        throw new Error('Ingredient already exists');
      }

      const ingredient = this.ingredientRepo.create(ingredientData);

      // Publish the ingredient creation event

      const savedIngredient = await this.ingredientRepo.save(ingredient);
      console.log('Saved ingredient:', savedIngredient);
      await this.handlePublishOrUpdateIngredient('create', savedIngredient);
      return savedIngredient;
    } catch (error: any) {
      console.log('Error creating ingredient:', error.message);
      throw new Error(`Error creating ingredient: ${error.message}`);
    }
  }

  async updateIngredient(
    id: number,
    data: Partial<Ingredient>,
    req: any,
  ): Promise<Ingredient> {
    try {
      // Check if the ingredient exists
      const ingredient = await this.ingredientRepo.findOne({ where: { id } });
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }

      //reject if not the creator
      if (ingredient.createdBy !== req.currentUser.id) {
        throw new Error('Not authorized to update ingredient');
      }

      // if the ingredient is not attached to any recipe, update the ingredient

      // if the ingredient is attached to a recipe, require moderation

      // Update the ingredient

      await this.ingredientRepo.update({ id }, data);

      // Publish the ingredient update event
      await this.handlePublishOrUpdateIngredient('update', data);
      return this.getIngredientById(id);
    } catch (error: any) {
      throw new Error(`Error updating ingredient: ${error.message}`);
    }
  }

  async deleteIngredient(id: number, req: any): Promise<void> {
    try {
      const ingredient = await this.ingredientRepo.findOne({ where: { id } });

      // Reject if not found
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }

      // Reject if not the creator
      if (ingredient.createdBy !== req.currentUser.id) {
        throw new NotAuthorizedError();
      }

      // Make request to recipe service to check if ingredient is attached to any recipe
      const isAttachedToRecipe = await this.isIngredientAttachedToRecipe(id);
      if (isAttachedToRecipe) {
        throw new BadRequestError('Ingredient is attached to a recipe');
      }

      // If the ingredient is not attached to any recipe, delete the ingredient
      await this.ingredientRepo.delete({ id });
    } catch (error: any) {
      throw new BadRequestError(`Error deleting ingredient: ${error.message}`);
    }
  }

  // Check if the ingredient is attached to any recipe
  private async isIngredientAttachedToRecipe(id: number): Promise<boolean> {
    const baseUrl = 'http://recipe-service.recipe.svc.cluster.local:3000'; // Extract base URL to environment variables
    console.log('Checking ingredient attachment to recipe');

    // TODO: Extract this to a helper function and correct url
    const url = `${baseUrl}/api/1/recipes/search?ingredientId=${id}`;
    console.log('URL:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SERVICE_API_KEY}`, // Pass an API key or JWT if required
        },
      });

      console.log('Response:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          // Ingredient not attached to any recipe
          return false;
        }
        throw new BadRequestError(
          `Error checking ingredient attachment ${response.statusText}`,
        );
      }

      // If the response is OK, the ingredient is attached
      return true;
    } catch (error: any) {
      console.error(
        'Error checking ingredient attachment to recipe:',
        error.message,
      );
      throw new Error('Unable to verify ingredient attachment');
    }
  }

  // Business for handling published messages to the exchange
  async handlePublishOrUpdateIngredient(
    action: string = 'create',
    data: Partial<Ingredient>,
    exchange: string = 'recipe.ingredients.inventory-updates',
    routingKey: string = 'ingredients.create.ingredient',
    type: Type = 'topic',
  ): Promise<void> {
    const broker = RabbitMQBroker.getInstance();
    await broker.init(this.rabbitMQUrl);

    const message = JSON.stringify(data);

    if (action) {
      routingKey = `recipe.ingredients.${action}.ingredient`;
    }

    // Publish ingredient creation event to the exchange
    await broker.publishToExchange(exchange, routingKey, message, {
      type,
      persitence: true,
    });
  }
}
