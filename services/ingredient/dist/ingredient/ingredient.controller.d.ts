import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
import { Ingredient } from '../lib/ingredient.entity';
import { IngredientSearchService } from './ingredient-search.service';
export declare class IngredientController {
    private readonly ingredientService;
    private readonly searchService;
    constructor(ingredientService: IngredientService, searchService: IngredientSearchService);
    createIngredient(req: Request, data: CreateIngredientDto): Promise<Ingredient>;
    getAllIngredients(): Promise<Ingredient[]>;
    getIngredientById(id: number): Promise<Ingredient>;
    updateIngredient(id: number, data: UpdateIngredientDto, req: Request): Promise<Ingredient>;
    deleteIngredient(id: number, req: Request): Promise<void>;
}
