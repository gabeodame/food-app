import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
export declare class IngredientSearchService {
    private readonly ingredientRepo;
    constructor(ingredientRepo: Repository<Ingredient>);
    search(filters: Record<string, any>): Promise<Ingredient[]>;
}
