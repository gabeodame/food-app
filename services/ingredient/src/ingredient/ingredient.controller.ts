import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
import { Ingredient } from '../lib/ingredient.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('ingredient')
@Controller('api/1/ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully created.',
    type: Ingredient,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async createIngredient(
    @Body() data: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientService.createIngredient(data);
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
    return this.ingredientService.getAllIngredients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return an ingredient by ID.',
    type: Ingredient,
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async getIngredientById(@Param('id') id: string): Promise<Ingredient> {
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
    @Param('id') id: string,
    @Body() data: UpdateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientService.updateIngredient(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ingredient by ID' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Something went wrong' })
  async deleteIngredient(@Param('id') id: string): Promise<void> {
    return this.ingredientService.deleteIngredient(id);
  }
}
