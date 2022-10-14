import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../user/user.service' 
import { User } from '../user/models/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
@Controller()
export class AuthController {

      constructor(private userService: UserService) {

      }



      @Post('register')
      async register(@Body() body: RegisterDto) {
            if(body.password !== body.password_confirm) {
                  throw new BadRequestException('passwords do not match');
            }
            //hashing passwords 
            const hashed = await bcrypt.hash(body.password, 12);
            
            return this.userService.create({
                  firstName: body.firstName,
                  last: body.last,
                  email: body.email,
                  password: hashed
      });
      }

}
