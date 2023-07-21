import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Recipe } from './model/recipe.entity';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private RecipeServiceRepo: RecipeService) {}

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.RecipeServiceRepo.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Recipe> {
    return this.RecipeServiceRepo.findById(id);
  }

  @Post()
  async create(@Body() task: Recipe): Promise<Recipe> {
    return this.RecipeServiceRepo.create(task);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() task: Recipe): Promise<Recipe> {
    return this.RecipeServiceRepo.update(id, task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Recipe> {
    return this.RecipeServiceRepo.delete(id);
  }
}
