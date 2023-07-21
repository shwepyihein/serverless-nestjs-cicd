import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
@ApiTags('recipe')
export class Recipe {
  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop({ default: false })
  @ApiProperty()
  category: string;

  @Prop({ default: false })
  @ApiProperty()
  ingredient: string[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
