import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IngredientSearchService } from './ingredient-search.service';
import { Ingredient } from '../lib/ingredient.entity';

@ApiTags('ingredient-search') // Separate Swagger tag for search
@ApiBearerAuth('bearerAuth') // Apply bearer auth
@Controller('api/1/ingredient/search') // Base path for search
export class IngredientSearchController {
  constructor(private readonly searchService: IngredientSearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search ingredients by query parameters' })
  @ApiResponse({
    status: 200,
    description: 'Return ingredients matching search criteria.',
    type: [Ingredient],
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by ingredient name (partial match, case-insensitive)',
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description:
      'Filter by ingredient category (partial match, case-insensitive)',
    type: String,
  })
  async searchIngredients(
    @Query() filters: Record<string, any>, // Capture query parameters
  ): Promise<Ingredient[]> {
    console.log('Search route reached');
    console.log('Filters:', filters);
    return this.searchService.search(filters);
  }
}
