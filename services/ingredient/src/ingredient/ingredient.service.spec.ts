import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngredientService } from './ingredient.service';
import { Ingredient } from '../lib/ingredient.entity';

describe('IngredientService', () => {
  let service: IngredientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
