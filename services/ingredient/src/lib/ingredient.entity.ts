import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Ingredient {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique ID of the ingredient',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Tomato', description: 'The name of the ingredient' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    example: 'Vegetables',
    description: 'The category of the ingredient',
  })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({
    example: 'grams',
    description: 'The unit of measurement for the ingredient',
  })
  @Column({ nullable: true })
  unit: string;

  @ApiProperty({
    example: 20.5,
    description: 'Calories per unit of the ingredient',
  })
  @Column({ nullable: true, type: 'float' })
  calories: number;

  @ApiProperty({
    example: 1.5,
    description: 'Protein per unit of the ingredient',
  })
  @Column({ nullable: true, type: 'float' })
  protein: number;

  @ApiProperty({ example: 0.2, description: 'Fat per unit of the ingredient' })
  @Column({ nullable: true, type: 'float' })
  fat: number;

  @ApiProperty({
    example: 4.0,
    description: 'Carbohydrates per unit of the ingredient',
  })
  @Column({ nullable: true, type: 'float' })
  carbohydrates: number;

  @ApiProperty({
    example: 'nuts, gluten',
    description: 'Allergens present in the ingredient',
  })
  @Column({ nullable: true })
  allergens: string;
}
