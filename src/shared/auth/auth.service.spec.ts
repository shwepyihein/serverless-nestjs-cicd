import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake_token'),
  };

  beforeEach(() => {
    authService = new AuthService(mockJwtService as any);
  });

  describe('generateJWT', () => {
    it('should return a JWT token', () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };

      const result = authService.generateJWT(user);

      expect(result).toBe('fake_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith(user);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const password = 'password123';

      const hashedPassword = await authService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
      expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      const password = 'password123';
      const hashedPassword = bcrypt.hashSync(password, 12);

      const isMatch = await authService.comparePasswords(
        password,
        hashedPassword,
      );

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password1 = 'password123';
      const password2 = 'password456';
      const hashedPassword = bcrypt.hashSync(password1, 12);

      const isMatch = await authService.comparePasswords(
        password2,
        hashedPassword,
      );

      expect(isMatch).toBe(false);
    });
  });
});
