import { NotFoundException, BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {

  constructor(private userService: UserService) {
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
      const user = await this.userService.findOne({email});

      if (!user) {
        throw new NotFoundException('User not Found');
      }
      if (!await bcrypt.compare(password, user.password)) {
        throw new BadRequestException('Invalid credentials');
      }
      return user;
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password != body.password_confirm) {
      throw new BadRequestException("Password do not match");
    }

    const hashed = await bcrypt.hash(body.password, 12);

    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: hashed,
    });
  }

}
