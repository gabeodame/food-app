import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IngredientCreatedEvent {
  @ApiProperty({
    example: 1,
    description: 'The unique ID of the ingredient',
  })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Tomato', description: 'The name of the ingredient' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Vegetables',
    description: 'The category of the ingredient',
  })
  @IsNotEmpty()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'grams',
    description: 'The unit of measurement for the ingredient',
  })
  @IsNotEmpty()
  @IsString()
  unit?: string;
}
