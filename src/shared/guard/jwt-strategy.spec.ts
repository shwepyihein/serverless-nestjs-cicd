import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: 'test-secret' }), // Provide a test secret for JWT
      ],
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'), // Mock the get method of ConfigService
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate the JWT payload and return user object', async () => {
    // Mock data
    const payload = {
      id: 'user_id',
      email: 'user@example.com',
      // Any other properties you have in the JWT payload
    };

    // Mock the behavior of the configService.get method to return the JWT_SECRET
    mockConfigService.get.mockReturnValue('your_jwt_secret_here');

    // Call the validate method
    const result = await jwtStrategy.validate(payload);

    // Expect the result to contain the user object with the correct id
    expect(result).toEqual({ user: 'user_id' });
  });

  // Add more test cases based on your needs
});
