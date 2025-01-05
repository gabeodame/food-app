import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories?: CategoryDto[];

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions!: InstructionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CuisineTypeDto)
  cuisineTypes?: CuisineTypeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeasonalEventDto)
  seasonalEvent?: SeasonalEventDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialDietDto)
  specialDiets?: SpecialDietDto[];
}

export class UpdateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories?: CategoryDto[];

  @IsNotEmpty()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions?: InstructionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CuisineTypeDto)
  cuisineTypes?: CuisineTypeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeasonalEventDto)
  seasonalEvent?: SeasonalEventDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialDietDto)
  specialDiets?: SpecialDietDto[];
}

export class CategoryDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class IngredientDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  quantity!: string;

  @IsOptional()
  recipeId?: number;
}

export class InstructionDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  step!: string;

  @IsOptional()
  recipeId?: number;
}
export class TagDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
export class CuisineTypeDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
export class SeasonalEventDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
export class SpecialDietDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

// class IngredientDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsString()
//   quantity: string;
// }

export type Recipe = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  userId: string; // Foreign key linking to the user who created the recipe
  views: number;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
  categories?: { id: number; name: string }[];
};
