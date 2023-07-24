import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './model/recipe.schema';
import { UpdateRecipeDto, createRecipeDto } from './model/recipe.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.recipeModel.find().skip(offset).limit(limit).exec(),
      this.recipeModel.countDocuments(),
    ]);

    const mappedData = data.map((item) => ({
      id: item.id,
      moogo_Id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      ingredients: item.ingredients,
    }));

    return { data: mappedData, total };
  }

  async findById(id: string) {
    return this.recipeModel.findById(id).exec();
  }

  async create(recipe: createRecipeDto) {
    const { title, ...otherFields } = recipe;

    // Check if the title already exists in the database
    const existingRecipe = await this.recipeModel.findOne({ title });

    if (existingRecipe) {
      throw new Error('Recipe with the same title already exists.');
    }

    // Generate a unique "id" for the new recipe
    const id = uuidv4();

    const newRecipe = new this.recipeModel({ ...otherFields, title, id });
    return newRecipe.save();
  }
  async update(id: string, recipe: UpdateRecipeDto) {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).exec();
  }

  async delete(id: string) {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }
}
