import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
import { Ingredient } from '../lib/ingredient.entity';
export declare class IngredientController {
    private readonly ingredientService;
    constructor(ingredientService: IngredientService);
    createIngredient(data: CreateIngredientDto): Promise<Ingredient>;
    getAllIngredients(): Promise<Ingredient[]>;
    getIngredientById(id: string): Promise<Ingredient>;
    updateIngredient(id: string, data: UpdateIngredientDto): Promise<Ingredient>;
    deleteIngredient(id: string): Promise<void>;
}
