import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/model/user.schema';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, unique: false })
  description: string;

  @Prop({ required: true, unique: false })
  category: string;

  @Prop({ required: true, unique: false })
  ingredients: string[];

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  user: User;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
