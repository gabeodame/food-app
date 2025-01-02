import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  async createIngredient(data: Partial<Ingredient>): Promise<Ingredient> {
    const ingredient = this.ingredientRepo.create(data);
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
