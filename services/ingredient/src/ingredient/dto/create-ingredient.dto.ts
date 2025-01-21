import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({
    description: 'The name of the ingredient',
    example: 'Tomato',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The category of the ingredient',
    example: 'Vegetables',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string; // Optional field, e.g., "Spices", "Vegetables"

  @ApiProperty({
    description: 'URL to an image of the ingredient',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'The unit of measurement for the ingredient',
    example: 'grams',
    required: false,
  })
  @IsOptional()
  @IsString()
  unit?: string; // e.g., "grams", "cups", etc.

  @ApiProperty({
    description: 'The number of calories in the ingredient',
    example: 22,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiProperty({
    description: 'The amount of protein in the ingredient',
    example: 1.2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  protein?: number;

  @ApiProperty({
    description: 'The amount of fat in the ingredient',
    example: 0.2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fat?: number;

  @ApiProperty({
    description: 'The amount of carbohydrates in the ingredient',
    example: 3.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  carbohydrates?: number;

  @ApiProperty({
    description: 'The amount of fiber in the ingredient',
    example: 1.2,
    required: false,
  })
  @IsOptional()
  @IsString()
  allergens?: string; // e.g., "nuts, gluten"
}
