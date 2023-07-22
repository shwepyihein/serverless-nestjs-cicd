import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

const uri =
  'mongodb+srv://shwepyihein:hYM2xXdrzJSk9oOJ@cluster0.aajjejj.mongodb.net/nestjs-crud?retryWrites=true&w=majority';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    MongooseModule.forRoot(uri),
    RecipeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
