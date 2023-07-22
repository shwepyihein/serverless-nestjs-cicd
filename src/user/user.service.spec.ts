import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/MoogooseTestModuel';

import { UserController } from './user.controller';
import { User } from './model/user.schema';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import { AuthService } from '../shared/auth/auth.service';
import { UserModule } from './user.module';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginDto, SignUpDto } from './model/user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let userService: UserService;
  let authService: AuthService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        SharedModule,
        JwtModule,
        ConfigModule.forRoot({ isGlobal: true }),
        rootMongooseTestModule(),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('signUp', () => {
    it('should create a new user and return an access token', async () => {
      // Mock signUpDto
      const signUpDto: SignUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock hashed password and user creation
      const hashedPassword = 'hashed_password';
      jest.spyOn(authService, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null); // User does not exist
      jest.spyOn(userModel, 'create').mockResolvedValueOnce({
        id: 'user_id',
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      } as any);

      // Mock access token generation
      const accessToken = 'generated_access_token';
      jest.spyOn(authService, 'generateJWT').mockReturnValue(accessToken);

      // Call the signUp method
      const result = await userService.signUp(signUpDto);

      // Assert the result
      expect(result).toEqual({ accesstoken: accessToken });
    });
  });

  it('should throw BadRequestException if user with the same email already exists', async () => {
    // Mock signUpDto
    const signUpDto: SignUpDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock existing user
    jest
      .spyOn(userModel, 'findOne')
      .mockResolvedValueOnce({ email: signUpDto.email } as User);

    // Call the signUp method and expect it to throw BadRequestException
    await expect(userService.signUp(signUpDto)).rejects.toThrowError(
      BadRequestException,
    );
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      // Mock loginDto
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'somepassword',
      };

      // Mock userModel.findOne to return null, simulating no user found
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      // Call the login method and expect it to throw UnauthorizedException
      await expect(userService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    // Mock data
    const loginDto: LoginDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    // Mock the behavior of the userModel.findOne method
    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

    // Call the login method and expect it to throw UnauthorizedException
    await expect(userService.login(loginDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    // Mock data
    const loginDto: LoginDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    // Mock the behavior of the userModel.findOne method
    const user = {
      email: loginDto.email,
      password: 'hashed_password', // Use the hashed password here
    } as User;

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);

    // Mock the behavior of the authService.comparePasswords method
    jest.spyOn(authService, 'comparePasswords').mockResolvedValueOnce(false);

    // Call the login method and expect it to throw UnauthorizedException
    await expect(userService.login(loginDto)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return access token if login is successful', async () => {
    // Mock data
    const loginDto: LoginDto = {
      email: 'user@example.com',
      password: 'password123',
    };

    // Mock the behavior of the userModel.findOne method
    const user = {
      email: loginDto.email,
      password: 'hashed_password', // Use the hashed password here
    } as LoginDto;

    jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user.email);

    // Mock the behavior of the authService.comparePasswords method
    jest.spyOn(authService, 'comparePasswords').mockResolvedValueOnce(true);

    // Mock the behavior of the authService.generateJWT method
    jest.spyOn(authService, 'generateJWT').mockReturnValueOnce('access_token');

    // Call the login method
    const result = await userService.login(loginDto);

    // Expect the result to contain the access token
    expect(result).toEqual({ accesstoken: 'access_token' });
  });
});
