import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { Recipe, RecipeDocument } from './model/recipe.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { rootMongooseTestModule } from '../../test/MoogooseTestModuel';
import { RecipeModule } from './recipe.module';
import { UpdateRecipeDto, createRecipeDto } from './model/recipe.dto';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<Recipe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot({ isGlobal: true }),
        SharedModule,
        JwtModule,
        RecipeModule,
      ],
      providers: [
        RecipeService,
        { provide: getModelToken(Recipe.name), useValue: recipeModel }, // Use the initialized recipeModel
      ],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    recipeModel = module.get<Model<Recipe>>(getModelToken(Recipe.name)); // Initialize recipeModel here
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(recipeService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated data and total count', async () => {
      // Mock data
      const recipe1 = {
        id: '1',
        title: 'Recipe 1',
        description: 'Description 1',
        category: 'Category 1',
        ingredients: ['Ingredient A', 'Ingredient B'],
      } as RecipeDocument;

      // Mock RecipeModel.find and RecipeModel.countDocuments
      const findMock = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([recipe1]),
      };
      jest.spyOn(recipeModel, 'find').mockReturnValue(findMock as any);

      jest.spyOn(recipeModel, 'countDocuments').mockResolvedValue(1);

      // Call the findAll method
      const page = 1;
      const limit = 10;
      const result = await recipeService.findAll(page, limit);

      console.log(result);

      // Assert the result to match the expected data
      expect(result).toEqual({
        data: [
          {
            id: '1',
            title: 'Recipe 1',
            description: 'Description 1',
            category: 'Category 1',
            ingredients: ['Ingredient A', 'Ingredient B'],
          },
        ],
        total: 1,
      });
    });
  });

  describe('findById', () => {
    it('should return the correct recipe when found', async () => {
      // Mock data
      const recipeId = '12345';
      const expectedResult = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        category: 'Test Category',
        ingredients: ['Ingredient A', 'Ingredient B'],
      } as RecipeDocument;

      // Mock RecipeModel.findById

      jest
        .spyOn(recipeModel, 'findById')
        .mockReturnValue({ exec: () => expectedResult } as any);

      // Call the findById method
      const result = await recipeService.findById(recipeId);
      console.log(result);

      // Assert the result to match the expected data
      expect(result).toEqual(expectedResult);

      // Verify that RecipeModel.findById was called with the correct parameter
      expect(recipeModel.findById).toHaveBeenCalledWith(recipeId);
    });

    it('should return null when recipe is not found', async () => {
      // Mock data
      const recipeId = 'non_existent_id';

      // Mock RecipeModel.findById
      jest
        .spyOn(recipeModel, 'findById')
        .mockReturnValue({ exec: () => null } as any);

      // Call the findById method
      const result = await recipeService.findById(recipeId);

      // Assert that the result is null
      expect(result).toBeNull();

      // Verify that RecipeModel.findById was called with the correct parameter
      expect(recipeModel.findById).toHaveBeenCalledWith(recipeId);
    });
  });

  describe('create', () => {
    it('should create a new recipe and return the created recipe', async () => {
      // Mock data
      const createRecipeDto: createRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        category: 'Test Category',
        ingredients: ['Ingredient A', 'Ingredient B'],
      };

      // Mock the behavior of the recipeModel.save method
      const savedRecipe = {
        id: '12345',
        ...createRecipeDto,
      };

      jest.spyOn(recipeModel.prototype, 'save').mockResolvedValue(savedRecipe);

      // Call the create method
      const result = await recipeService.create(createRecipeDto);

      // Assert the result to match the expected data
      expect(result).toEqual(savedRecipe);

      // Verify that recipeModel.save was called with the correct parameter
      expect(recipeModel.prototype.save).toHaveBeenCalledWith();
    });
  });

  describe('delete', () => {
    it('should delete a recipe and return the deleted recipe', async () => {
      // Mock data
      const recipeId = '12345';

      // Mock RecipeModel.findByIdAndDelete
      const deletedRecipe = {
        id: recipeId,
        title: 'Test Recipe',
        description: 'Test Description',
        category: 'Test Category',
        ingredients: ['Ingredient A', 'Ingredient B'],
      } as RecipeDocument;

      jest
        .spyOn(recipeModel, 'findByIdAndDelete')
        .mockReturnValue({ exec: () => deletedRecipe } as any);

      // Call the delete method
      const result = await recipeService.delete(recipeId);

      // Assert the result to match the deleted recipe data
      expect(result).toEqual(deletedRecipe);

      // Verify that RecipeModel.findByIdAndDelete was called with the correct parameter
      expect(recipeModel.findByIdAndDelete).toHaveBeenCalledWith(recipeId);
    });
  });

  describe('update', () => {
    it('should update the recipe and return the updated recipe', async () => {
      // Mock data
      const recipeId = '12345';
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe Title',
        description: 'Updated Description',
        category: 'Updated Category',
        ingredients: ['Updated Ingredient A', 'Updated Ingredient B'],
      };

      // Mock the behavior of the recipeModel.findByIdAndUpdate method
      const updatedRecipe = {
        id: recipeId,
        ...updateRecipeDto,
      };

      jest
        .spyOn(recipeModel, 'findByIdAndUpdate')
        .mockReturnValue({ exec: () => updatedRecipe } as any);

      // Call the update method
      const result = await recipeService.update(recipeId, updateRecipeDto);

      // Assert the result to match the expected data
      expect(result).toEqual(updatedRecipe);

      // Verify that recipeModel.findByIdAndUpdate was called with the correct parameters
      expect(recipeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        recipeId,
        updateRecipeDto,
        { new: true },
      );
    });
  });
});
