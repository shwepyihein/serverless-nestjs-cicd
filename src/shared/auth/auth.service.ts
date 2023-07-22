import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user) {
    return this.jwtService.sign(user);
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  comparePasswords(newPassword: string, passwortHash: string) {
    return bcrypt.compare(newPassword, passwortHash);
  }
}
