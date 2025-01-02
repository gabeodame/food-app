import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../lib/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientService],
  controllers: [IngredientController],
})
export class IngredientModule {}
