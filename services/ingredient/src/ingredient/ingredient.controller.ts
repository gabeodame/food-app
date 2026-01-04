import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  // UseGuards,
  Req,
  Request,
  Query,
  // Query,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
import { Ingredient } from '../lib/ingredient.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IngredientSearchService } from './ingredient-search.service';
import { BadRequestError } from '@gogittix/common';

@ApiTags('ingredient')
@ApiBearerAuth('bearerAuth') // Apply bearer auth
@Controller('api/1/ingredient')
export class IngredientController {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly searchService: IngredientSearchService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully created.',
    type: Ingredient,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async createIngredient(
    @Req() req: Request,
    @Body() data: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientService.createIngredient(data, req);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({
    status: 200,
    description: 'Return all ingredients.',
    type: [Ingredient],
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getAllIngredients(): Promise<Ingredient[]> {
    try {
      // requireAuth(req);

      return this.ingredientService.getAllIngredients();
    } catch (error) {
      console.log('[Ingredeint Get Route]: ', error.message);
      return error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return an ingredient by ID.',
    type: Ingredient,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getIngredientById(@Param('id') id: number): Promise<Ingredient> {
    return this.ingredientService.getIngredientById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the updated ingredient.',
    type: Ingredient,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  @ApiBody({
    description: 'Partial update of an ingredient',
    examples: {
      example1: {
        summary: 'Update name and category',
        value: {
          name: 'Carrot',
          category: 'Vegetable',
        },
      },
      example2: {
        summary: 'Update nutrition info',
        value: {
          calories: 30,
          protein: 1.5,
        },
      },
    },
  })
  async updateIngredient(
    @Param('id') id: number,
    @Body() data: UpdateIngredientDto,
    @Req() req: Request,
  ): Promise<Ingredient> {
    return this.ingredientService.updateIngredient(id, data, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async deleteIngredient(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<void> {
    return this.ingredientService.deleteIngredient(id, req);
  }

  @Get('batch')
  @ApiOperation({ summary: 'Fetch multiple ingredients by IDs' })
  @ApiResponse({
    status: 200,
    description: 'Return multiple ingredients.',
    type: [Ingredient],
  })
  @ApiQuery({
    name: 'ids',
    required: true,
    description: 'Comma-separated list of ingredient IDs (e.g., "1,2,3")',
    type: String,
    example: '1,2,3',
  })
  async getIngredientsByIds(@Query('ids') ids: string): Promise<Ingredient[]> {
    if (!ids) throw new BadRequestError('Ingredient IDs are required.');

    // ✅ Trim whitespace, split by ",", and filter out empty strings
    const idArray = ids
      .split(',')
      .map((id) => id.trim()) // Remove extra spaces
      .filter((id) => id !== '') // Remove empty strings
      .map((id) => parseInt(id, 10)) // Convert to numbers
      .filter((id) => !isNaN(id)); // ✅ Remove NaN values

    console.log('Valid ID array:', idArray);

    if (idArray.length === 0) {
      throw new BadRequestError(
        'At least one valid ingredient ID is required.',
      );
    }

    return this.ingredientService.getIngredientsByIds(idArray);
  }
}
