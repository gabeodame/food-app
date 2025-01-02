import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
export declare class IngredientService {
    private readonly ingredientRepo;
    constructor(ingredientRepo: Repository<Ingredient>);
    createIngredient(data: Partial<Ingredient>): Promise<Ingredient>;
    getAllIngredients(): Promise<Ingredient[]>;
    getIngredientById(id: string): Promise<Ingredient>;
    updateIngredient(id: string, data: Partial<Ingredient>): Promise<Ingredient>;
    deleteIngredient(id: string): Promise<void>;
}
