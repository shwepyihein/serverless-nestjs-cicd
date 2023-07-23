import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/model/user.schema';

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
