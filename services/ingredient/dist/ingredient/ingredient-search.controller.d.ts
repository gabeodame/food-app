import { IngredientSearchService } from './ingredient-search.service';
import { Ingredient } from '../lib/ingredient.entity';
export declare class IngredientSearchController {
    private readonly searchService;
    constructor(searchService: IngredientSearchService);
    searchIngredients(filters: Record<string, any>): Promise<Ingredient[]>;
}
