import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignUpDto } from './model/user.dto';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('onBoarding')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const result = await this.userService.signUp(signUpDto);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.userService.login(loginDto);
      return { success: true, data: result };
    } catch (error) {
      throw new BadRequestException({ success: false, message: error.message });
    }
  }
}
