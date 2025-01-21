import { Repository } from 'typeorm';
import { Ingredient } from '../lib/ingredient.entity';
type Type = 'topic' | 'direct' | 'fanout' | 'headers';
export declare class IngredientService {
    private readonly ingredientRepo;
    private rabbitMQUrl;
    constructor(ingredientRepo: Repository<Ingredient>);
    getAllIngredients(): Promise<Ingredient[]>;
    getIngredientById(id: number): Promise<Ingredient>;
    createIngredient(data: Partial<Ingredient>, req: any): Promise<Ingredient>;
    updateIngredient(id: number, data: Partial<Ingredient>, req: any): Promise<Ingredient>;
    deleteIngredient(id: number, req: any): Promise<void>;
    private isIngredientAttachedToRecipe;
    handlePublishOrUpdateIngredient(action: string, data: Partial<Ingredient>, exchange?: string, routingKey?: string, type?: Type): Promise<void>;
}
export {};
