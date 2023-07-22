import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { rootMongooseTestModule } from '../test/MoogooseTestModuel';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        UserModule,
        RecipeModule,
        ConfigModule.forRoot({ isGlobal: true }),
        rootMongooseTestModule(),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
