import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/model/user.schema';
import { v4 as uuidv4 } from 'uuid';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false, required: true })
  category: string;

  @Prop({ required: true })
  ingredients: string[];

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  user: User;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
