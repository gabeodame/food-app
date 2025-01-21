import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../lib/ingredient.entity';
import { IngredientSearchService } from './ingredient-search.service';
import { IngredientSearchController } from './ingredient-search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientService, IngredientSearchService],
  controllers: [IngredientSearchController, IngredientController],
})
export class IngredientModule {}
