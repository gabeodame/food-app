import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEmail,
  IsNumber,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreateRecipeDto {
  // @IsNotEmpty()
  // @IsString()
  // id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  // @IsString()
  // slug!: string;

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

  // @IsNotEmpty()
  // @IsString()
  // userId!: string;

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

  @IsOptional() // ✅ Now optional for updates
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional() // ✅ Now optional
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions?: InstructionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];

  @IsOptional() // ✅ Ensure optional
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

  @IsOptional() // ✅ Add `seasons` if needed
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeasonalEventDto)
  seasons?: SeasonalEventDto[];
}

export class CategoryDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

// export class IngredientDto {
//   @IsOptional()
//   id!: number;

//   @IsNotEmpty()
//   @IsString()
//   name!: string;

//   @IsOptional()
//   @IsNumber()
//   quantity?: number | null; // Accepts null

//   @IsOptional()
//   @IsArray()
//   @IsNumber({}, { each: true })
//   recipeIds?: number[]; // Represents associated recipes
// }

export class IngredientDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined)) // Ensure it's a number
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (value === null ? null : Number(value))) // Ensure number or null
  @IsNumber()
  quantity?: number | null;

  @IsOptional()
  @IsString()
  unit?: string; // ✅ Add if required

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recipeIds?: number[];
}

export class CachedIngredientDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number | null; // Accepts null

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recipeIds?: number[]; // Represents associated recipes
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

export class RecipeUser {
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

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
