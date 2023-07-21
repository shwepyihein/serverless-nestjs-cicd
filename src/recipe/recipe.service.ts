import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './model/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private RecipeModel: Model<RecipeDocument>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    const result = await this.RecipeModel.find().exec();

    return result.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      ingredient: item.ingredient,
    }));
  }

  async findById(id: string): Promise<Recipe> {
    return this.RecipeModel.findById(id).exec();
  }

  async create(task: Recipe): Promise<Recipe> {
    const newTask = new this.RecipeModel(task);
    return newTask.save();
  }

  async update(id: string, task: Recipe): Promise<Recipe> {
    return this.RecipeModel.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async delete(id: string): Promise<Recipe> {
    return this.RecipeModel.findByIdAndDelete(id).exec();
  }
}
