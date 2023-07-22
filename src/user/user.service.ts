import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.schema';
import { Model } from 'mongoose';
import { LoginDto, SignUpDto } from './model/user.dto';
import { AuthService } from '../shared/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;
    const hashedPassword = await this.authService.hashPassword(password);

    const existUser = await this.userModel.findOne({ email });

    if (existUser) {
      throw new BadRequestException('Account have already Exist');
    }

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const accesstoken = this.authService.generateJWT({
      id: user.id,
    });
    return { accesstoken };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Please creat your account');
    }
    const isPasswordMatched = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const accesstoken = this.authService.generateJWT({
      id: user.id,
    });
    return { accesstoken };
  }
}
