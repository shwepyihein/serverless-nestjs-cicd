import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { UpdateRecipeDto } from './model/recipe.dto';
import { BadRequestException } from '@nestjs/common';

// Mock the RecipeService
jest.mock('./recipe.service');

describe('RecipeController', () => {
  let recipeController: RecipeController;
  let recipeService: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [RecipeService],
    }).compile();

    recipeController = module.get<RecipeController>(RecipeController);
    recipeService = module.get<RecipeService>(RecipeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(recipeController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated data when successful', async () => {
      // Mock the service method to return the expected data
      const expectedResult = {
        data: [
          {
            id: '1',

            title: 'Recipe 1',
            description: 'Description 1',
            category: 'Category 1',
            ingredients: ['Ingredient A', 'Ingredient B'],
          },
          // Add more recipe data as needed
        ],
        total: 2, // Total number of recipes
      };

      jest
        .spyOn(recipeService, 'findAll')
        .mockResolvedValue(expectedResult as any);

      // Call the findAll method of the controller
      const page = 1;
      const limit = 10;
      const result = await recipeController.findAll(page, limit);

      // Assert the result to match the expected data
      expect(result).toEqual({ success: true, data: expectedResult });
    });
    it('should handle error and return error message', async () => {
      // Mock data
      const page = 1;
      const limit = 10;
      const errorMessage = 'An error occurred while fetching recipes.';

      // Mock the behavior of the recipeServiceRepo.findAll method to throw an error

      jest
        .spyOn(recipeService, 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      // Call the findAll method
      try {
        await recipeController.findAll(page, limit);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
  describe('findById', () => {
    it('should call RecipeService.findById with correct parameter and return the result', async () => {
      // Mock RecipeService.findById result
      const id = '12345';
      const expectedResult = {
        id,
        title: 'Test Recipe',
        category: 'Test Category',
        description: 'Test Description',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashed_password',
        },
      };

      jest
        .spyOn(recipeService, 'findById')
        .mockResolvedValue(expectedResult as any);

      // Call the findById method
      const result = await recipeController.findById(id);

      // Assert the result to match the expected result
      expect(result).toEqual({ success: true, data: expectedResult });

      // Verify that RecipeService.findById was called with the correct parameter
      expect(recipeService.findById).toHaveBeenCalledWith(id);
    });

    it('should handle error and return error message', async () => {
      // Mock data
      const id = '12345';
      const errorMessage = 'An error occurred while fetching  recipe by Id.';

      jest
        .spyOn(recipeService, 'findById')
        .mockRejectedValue(new Error(errorMessage));

      try {
        await recipeController.findById(id);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('create', () => {
    // Mock RecipeService.create result
    const recipeData = {
      title: 'New Recipe',
      category: '',
      description: 'New Description',
      ingredients: [],
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password',
      },
    };
    it('should call RecipeService.create with correct data and return the result', async () => {
      const expectedResult = { id: '12345', ...recipeData };

      jest
        .spyOn(recipeService, 'create')
        .mockResolvedValue(expectedResult as any);
      // Call the create method
      const result = await recipeController.create(recipeData);

      // Assert the result to match the expected result
      expect(result).toEqual({ success: true, data: expectedResult });

      // Verify that RecipeService.create was called with the correct data
      expect(recipeService.create).toHaveBeenCalledWith(recipeData);
    });

    it('should handle error and return error message', async () => {
      // Mock data

      const errorMessage = 'An error occurred while creating recipes.';

      // Mock the behavior of the recipeServiceRepo.findAll method to throw an error

      jest
        .spyOn(recipeService, 'create')
        .mockRejectedValue(new Error(errorMessage));

      try {
        await recipeController.create(recipeData);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      } // Call the findAll method
    });
  });

  describe('update', () => {
    const id = '12345';
    const recipeData = {
      title: 'New Recipe',
      category: '',
      description: 'New Description',
      ingredients: [],
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password',
      },
    };
    it('should call RecipeService.update with correct parameters and return the result', async () => {
      // Mock RecipeService.update result

      const expectedResult: UpdateRecipeDto = { ...recipeData };
      jest
        .spyOn(recipeService, 'update')
        .mockResolvedValue(expectedResult as any);

      // Call the update method
      const result = await recipeController.update(id, recipeData);

      // Assert the result to match the expected result
      expect(result).toEqual({ success: true, data: expectedResult });

      // Verify that RecipeService.update was called with the correct parameters
      expect(recipeService.update).toHaveBeenCalledWith(id, recipeData);
    });
    it('should handle error and return error message', async () => {
      const errorMessage = 'An error occurred while updating recipes.';

      jest
        .spyOn(recipeService, 'update')
        .mockRejectedValue(new Error(errorMessage));

      // Call the findAll method

      try {
        await recipeController.update(id, recipeData);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
      // Expect the result to contain the error message
    });
  });

  describe('delete', () => {
    const id = '12345';
    it('should call RecipeService.delete with correct parameter and return the result', async () => {
      jest.spyOn(recipeService, 'delete').mockResolvedValue(null);

      // Call the delete method
      const result = await recipeController.delete(id);

      // Assert the result to match the expected result
      expect(result).toEqual({ success: true, data: null });

      // Verify that RecipeService.delete was called with the correct parameter
      expect(recipeService.delete).toHaveBeenCalledWith(id);
    });

    it('should handle error and return error message', async () => {
      // Mock data

      const errorMessage = 'An error occurred while deleting recipes.';

      // Mock the behavior of the recipeServiceRepo.findAll method to throw an error

      jest
        .spyOn(recipeService, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      try {
        await recipeController.delete(id);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }

      // Expect the result to contain the error message
    });
  });
});
