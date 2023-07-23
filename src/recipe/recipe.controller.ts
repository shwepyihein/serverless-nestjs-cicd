import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { Recipe } from './model/recipe.schema';
import { RecipeService } from './recipe.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { UpdateRecipeDto, createRecipeDto } from './model/recipe.dto';

@Controller('recipes')
@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RecipeController {
  constructor(private recipeServiceRepo: RecipeService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: true })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.recipeServiceRepo.findAll(page, limit);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const result = await this.recipeServiceRepo.findById(id);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  @Post()
  async create(@Body() data: createRecipeDto) {
    try {
      const result = await this.recipeServiceRepo.create(data);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateRecipeDto) {
    try {
      const result = await this.recipeServiceRepo.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const result = await this.recipeServiceRepo.delete(id);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }
}
