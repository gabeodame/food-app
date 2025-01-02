import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  category: string; // e.g., "Spices", "Vegetables"

  @Column({ nullable: true })
  unit: string; // e.g., "grams", "cups", "tablespoons"

  @Column({ nullable: true, type: 'float' })
  calories: number;

  @Column({ nullable: true, type: 'float' })
  protein: number;

  @Column({ nullable: true, type: 'float' })
  fat: number;

  @Column({ nullable: true, type: 'float' })
  carbohydrates: number;

  @Column({ nullable: true })
  allergens: string; // e.g., "nuts, gluten"
}
