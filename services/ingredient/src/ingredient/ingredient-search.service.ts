import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';

@Injectable()
export class IngredientSearchService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  /**
   * Dynamically search for ingredients based on query parameters.
   * @param filters Query parameters to filter the ingredients.
   * @returns List of matching ingredients.
   */
  async search(filters: Record<string, any>) {
    console.log('Filters:', filters);

    const where = Object.entries(filters).map(([key, value]) => {
      if (typeof value === 'string') {
        return { [key]: ILike(`%${value}%`) }; // Case-insensitive match for strings
      } else {
        return { [key]: value }; // Exact match for other types
      }
    });

    console.log('Where Clause:', where);

    return this.ingredientRepo.find({
      where,
      order: { name: 'ASC' },
      take: 20, // Limit results
    });
  }
}
