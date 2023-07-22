import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './model/recipe.schema';
import { UpdateRecipeDto, createRecipeDto } from './model/recipe.dto';

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

  async create(recipe: createRecipeDto): Promise<Recipe> {
    const newRecipe = new this.recipeModel(recipe);
    return newRecipe.save();
  }

  async update(id: string, recipe: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).exec();
  }

  async delete(id: string): Promise<Recipe> {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }
}
