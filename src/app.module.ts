import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { RecipeModule } from './recipe/recipe.module';

const uri =
  'mongodb+srv://shwepyihein:hYM2xXdrzJSk9oOJ@cluster0.aajjejj.mongodb.net/nestjs-crud?retryWrites=true&w=majority';

@Module({
  imports: [MongooseModule.forRoot(uri), RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
