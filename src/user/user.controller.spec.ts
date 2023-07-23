import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginDto, SignUpDto } from './model/user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Create a custom mock for UserService
const userServiceMock = {
  signUp: jest.fn(),
  login: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock }, // Provide the mock UserService
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call userService.signUp with the correct arguments and return the access token', async () => {
      // Mock signUpDto
      const signUpDto: SignUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock the return value from userService.signUp
      const accessToken = 'generated_access_token';
      userServiceMock.signUp.mockResolvedValue({ accesstoken: accessToken });

      // Call the signUp method
      const result = await userController.signUp(signUpDto);

      // Assert the result to contain the correct access token
      expect(result).toEqual({
        success: true,
        data: { accesstoken: accessToken },
      });

      // Verify that userService.signUp was called with the correct arguments
      expect(userServiceMock.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should return error message when userService.signUp throws BadRequestException', async () => {
      // Mock signUpDto
      const signUpDto: SignUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock the error thrown by userService.signUp
      const errorMessage = 'Account already exists';
      userServiceMock.signUp.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      try {
        await userController.signUp(signUpDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
      // Call the signUp method

      // Assert the result to contain the correct error message

      // Verify that userService.signUp was called with the correct arguments
      expect(userServiceMock.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('login', () => {
    it('should call userService.login with the correct arguments and return the access token', async () => {
      // Mock loginDto
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock the return value from userService.login
      const accessToken = 'generated_access_token';
      userServiceMock.login.mockResolvedValue({ accesstoken: accessToken });

      // Call the login method
      const result = await userController.login(loginDto);

      // Assert the result to contain the correct access token
      expect(result).toEqual({
        success: true,
        data: { accesstoken: accessToken },
      });

      // Verify that userService.login was called with the correct arguments
      expect(userServiceMock.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return error message when userService.login throws UnauthorizedException', async () => {
      // Mock loginDto
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      // Mock the error thrown by userService.login
      const errorMessage = 'Invalid credentials';
      userServiceMock.login.mockRejectedValue(
        new UnauthorizedException(errorMessage),
      );

      // Call the login method

      try {
        await userController.login(loginDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
      // Assert the result to contain the correct error message

      // Verify that userService.login was called with the correct arguments
      expect(userServiceMock.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
